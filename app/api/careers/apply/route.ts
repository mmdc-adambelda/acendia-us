import { NextRequest, NextResponse } from "next/server";
import { applicationFieldsSchema, ALLOWED_CV_TYPES, MAX_CV_BYTES } from "@/lib/validation/careers";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates } from "@/lib/email";
import { getJob } from "@/lib/careers";

const CAREERS_INBOX = "support@acendia.agency";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`careers-apply:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const result = applicationFieldsSchema.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    phone: form.get("phone") ?? "",
    linkedInOrPortfolio: form.get("linkedInOrPortfolio") ?? "",
    message: form.get("message"),
    jobSlug: form.get("jobSlug"),
    jobTitle: form.get("jobTitle"),
    company_website: form.get("company_website") ?? "",
  });

  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form for errors.", issues: result.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot tripped — silently accept so bots don't learn it failed.
  if (result.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const job = getJob(result.data.jobSlug);
  if (!job) {
    return NextResponse.json({ ok: false, error: "That role couldn't be found." }, { status: 404 });
  }

  // CV is optional for coming-soon roles (expression of interest), but if
  // one is attached it's validated regardless of role status.
  const cv = form.get("cv");
  let attachments: { filename: string; content: Buffer }[] = [];
  if (cv instanceof File && cv.size > 0) {
    if (!ALLOWED_CV_TYPES.includes(cv.type)) {
      return NextResponse.json({ ok: false, error: "CV must be a PDF or Word document." }, { status: 422 });
    }
    if (cv.size > MAX_CV_BYTES) {
      return NextResponse.json({ ok: false, error: "CV file is too large (8MB max)." }, { status: 422 });
    }
    const buffer = Buffer.from(await cv.arrayBuffer());
    attachments = [{ filename: cv.name || "cv", content: buffer }];
  }

  const sent = await sendEmail({
    to: CAREERS_INBOX,
    subject: `New application: ${job.title} — ${result.data.fullName}`,
    html: emailTemplates.jobApplication({
      jobTitle: job.title,
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone ?? "",
      linkedInOrPortfolio: result.data.linkedInOrPortfolio ?? "",
      message: result.data.message,
    }),
    replyTo: result.data.email,
    attachments: attachments.length ? attachments : undefined,
  });

  if (!sent) {
    // Resend isn't configured or the send failed — tell the applicant
    // plainly rather than pretending it worked, per the site-wide rule of
    // never silently swallowing a failure the user needs to know about.
    console.error("Job application email failed to send", { job: job.slug, email: result.data.email });
    return NextResponse.json(
      { ok: false, error: `Something went wrong sending your application. Please email it directly to ${CAREERS_INBOX}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
