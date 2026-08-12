import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

const bodySchema = z.object({ paymentId: z.string().uuid() });

/**
 * The one place a Wise (manual) payment ever becomes "paid" — staff
 * confirms they saw the transfer land, matching the reference number
 * generated at checkout. This also activates the linked subscription. This
 * is intentionally the ONLY path to Wise activation; nothing about the
 * checkout flow or a redirect URL can mark a Wise payment as paid — see
 * lib/payments/wise.ts and CLIENT-PORTAL-IMPLEMENTATION.md §5.
 */
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
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payment id." }, { status: 422 });
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", parsed.data.paymentId)
    .eq("payment_provider", "wise")
    .eq("status", "pending")
    .select("id, organization_id, subscription_id")
    .maybeSingle();

  if (paymentError || !payment) {
    return NextResponse.json(
      { ok: false, error: "Not authorized, already confirmed, or payment not found." },
      { status: 403 },
    );
  }

  if (payment.subscription_id) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .eq("id", payment.subscription_id);
  }

  const admin = createAdminClient();
  await admin.from("activity_logs").insert({
    organization_id: payment.organization_id,
    actor_id: user.id,
    action: "wise_payment_confirmed",
    metadata: { paymentId: payment.id, subscriptionId: payment.subscription_id, confirmedBy: user.id },
  });

  await notifyOrganization({
    organizationId: payment.organization_id,
    type: "subscription_activated",
    title: "Payment confirmed",
    body: "We've confirmed your Wise transfer and activated your subscription.",
    linkUrl: "/portal/",
  });
  const contact = await getOrgContactInfo(payment.organization_id);
  if (contact?.email) {
    await sendEmail({
      to: contact.email,
      subject: "Payment confirmed — your Acendia subscription is active",
      html: emailTemplates.wisePaymentConfirmed(contact.orgName),
    });
  }

  return NextResponse.json({ ok: true });
}
