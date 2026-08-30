import { NextRequest, NextResponse } from "next/server";
import { getLeadMagnet } from "@/lib/leadMagnets";
import { leadMagnetFormSchema } from "@/lib/validation/leadMagnets";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates } from "@/lib/email";
import { signDownloadToken } from "@/lib/leadMagnetDownload";

const NOTIFY_INBOX = "support@acendia.agency";

/**
 * Generic lead-magnet subscribe endpoint, parameterized by slug so every
 * future lead magnet (see lib/leadMagnets.ts) reuses this exact route
 * instead of a one-off per magnet. Plain HTML form target (parses
 * req.formData(), always redirects, never JSON) — same reasoning as
 * every other public lead form in this app: a real top-level form
 * submission is far more resistant to a browser/extension silently
 * withholding anything than a JS fetch() call is.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);

  if (!magnet) {
    return NextResponse.redirect(new URL("/", req.url), 303);
  }

  const redirectToLanding = (error: string) => {
    const url = new URL(magnet.path, req.url);
    url.searchParams.set("error", error);
    return NextResponse.redirect(url, 303);
  };

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`lead-magnet-subscribe:${slug}:${ip}`)) {
    return redirectToLanding("Too many requests. Please try again in a minute.");
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectToLanding("Invalid request. Please try again.");
  }

  const result = leadMagnetFormSchema.safeParse({
    fullName: formData.get("fullName"),
    businessName: formData.get("businessName"),
    workEmail: formData.get("workEmail"),
    phone: formData.get("phone"),
    websiteUrl: formData.get("websiteUrl"),
    challenge: formData.get("challenge") ?? "",
    middle_name: formData.get("middle_name") ?? "",
  });

  if (!result.success) {
    return redirectToLanding("Please check the form for errors and try again.");
  }
  const data = result.data;

  const redirectToUnlock = () => {
    const url = new URL(`${magnet.path}thank-you/`, req.url);
    const token = signDownloadToken(slug);
    if (token) {
      url.searchParams.set("token", token);
    } else {
      // Not configured — never expose a broken/unsigned download link.
      console.error("lead-magnet subscribe: LEAD_MAGNET_DOWNLOAD_SECRET not configured — no download token issued", { slug });
      url.searchParams.set("unlock_unavailable", "1");
    }
    return NextResponse.redirect(url, 303);
  };

  // Honeypot tripped — pretend success so bots don't learn it failed, and
  // skip sending a notification email for what's almost certainly spam.
  if (data.middle_name) {
    return redirectToUnlock();
  }

  const sent = await sendEmail({
    to: NOTIFY_INBOX,
    subject: `New SEO Ebook Lead — ${data.businessName}`,
    html: emailTemplates.leadMagnetNotification({
      magnetName: magnet.name,
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.workEmail,
      phone: data.phone,
      websiteUrl: data.websiteUrl,
      challenge: data.challenge ?? "",
      landingPage: magnet.path,
    }),
    replyTo: data.workEmail,
  });

  if (!sent) {
    // Never lose the lead over an email hiccup — log it server-side so
    // it's at least recoverable, and still let the visitor through to
    // their download. Losing the conversion because our internal
    // notification failed would be worse than a missed email.
    console.error("lead-magnet subscribe: notification email failed to send", {
      slug,
      businessName: data.businessName,
      email: data.workEmail,
      phone: data.phone,
      websiteUrl: data.websiteUrl,
    });
  }

  return redirectToUnlock();
}
