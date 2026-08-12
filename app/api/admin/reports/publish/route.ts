import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

const bodySchema = z.object({ reportId: z.string().uuid(), publish: z.boolean() });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 422 });

  const { data, error } = await supabase
    .from("reports")
    .update({ published_at: parsed.data.publish ? new Date().toISOString() : null })
    .eq("id", parsed.data.reportId)
    .select("id, organization_id, month")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Not authorized or report not found." }, { status: 403 });
  }

  if (parsed.data.publish) {
    const monthLabel = new Date(data.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    await notifyOrganization({
      organizationId: data.organization_id,
      type: "report_published",
      title: `Your ${monthLabel} report is ready`,
      linkUrl: "/portal/reports/",
    });
    const contact = await getOrgContactInfo(data.organization_id);
    if (contact?.email) {
      await sendEmail({
        to: contact.email,
        subject: `Your ${monthLabel} Acendia report is ready`,
        html: emailTemplates.newReport(contact.orgName, monthLabel),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
