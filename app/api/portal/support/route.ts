import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates, getAdminNotificationEmail } from "@/lib/email";

const bodySchema = z.object({
  category: z.string().trim().min(1).max(80),
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(4000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`portal-support:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fill out all fields." }, { status: 422 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return NextResponse.json({ ok: false, error: "No account found." }, { status: 404 });

  const { error } = await supabase.from("support_tickets").insert({
    organization_id: membership.organization_id,
    created_by: user.id,
    category: parsed.data.category,
    subject: parsed.data.subject,
    description: parsed.data.description,
  });

  if (error) {
    console.error("Failed to create support ticket", error);
    return NextResponse.json({ ok: false, error: "Could not submit ticket. Please try again." }, { status: 500 });
  }

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    const { data: org } = await supabase.from("organizations").select("name").eq("id", membership.organization_id).maybeSingle();
    await sendEmail({
      to: adminEmail,
      subject: `New support ticket: ${parsed.data.subject}`,
      html: emailTemplates.adminNewSupportTicket(org?.name ?? "A client", parsed.data.subject),
    });
  }

  return NextResponse.json({ ok: true });
}
