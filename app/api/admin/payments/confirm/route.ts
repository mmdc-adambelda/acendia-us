import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";
import { estimateDefaultBillingStart } from "@/lib/billing";

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
    .select("id, organization_id, subscription_id, description, amount_cents")
    .maybeSingle();

  if (paymentError || !payment) {
    return NextResponse.json(
      { ok: false, error: "Not authorized, already confirmed, or payment not found." },
      { status: 403 },
    );
  }

  // Real Acendia billing schedule (see lib/billing.ts): confirming the
  // ONE-TIME SETUP FEE does not start monthly billing — it just means the
  // campaign is starting. Confirming a MONTHLY payment (a separate,
  // later Wise invoice staff creates once the site is live) is what
  // actually activates ongoing billing. Distinguished by description since
  // Wise has no separate "payment type" column.
  const isSetupFeePayment = (payment.description ?? "").toLowerCase().includes("setup fee");

  if (payment.subscription_id) {
    if (isSetupFeePayment) {
      await supabase
        .from("subscriptions")
        .update({
          status: "trialing",
          current_period_start: new Date().toISOString(),
          current_period_end: estimateDefaultBillingStart().toISOString(),
        })
        .eq("id", payment.subscription_id);
    } else {
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
  }

  const admin = createAdminClient();
  await admin.from("activity_logs").insert({
    organization_id: payment.organization_id,
    actor_id: user.id,
    action: isSetupFeePayment ? "wise_setup_fee_confirmed" : "wise_monthly_payment_confirmed",
    metadata: { paymentId: payment.id, subscriptionId: payment.subscription_id, confirmedBy: user.id },
  });

  await notifyOrganization({
    organizationId: payment.organization_id,
    type: isSetupFeePayment ? "setup_fee_paid" : "subscription_activated",
    title: isSetupFeePayment ? "Setup payment received" : "Payment confirmed",
    body: isSetupFeePayment
      ? "We've confirmed your Wise transfer. We're building your site now — your first monthly payment isn't due until 14 days after it goes live."
      : "We've confirmed your Wise transfer for this month.",
    linkUrl: "/portal/billing/",
  });
  const contact = await getOrgContactInfo(payment.organization_id);
  if (contact?.email) {
    await sendEmail({
      to: contact.email,
      subject: isSetupFeePayment ? "Payment received — we're building your site" : "Payment confirmed",
      html: isSetupFeePayment ? emailTemplates.setupFeePaid(contact.orgName) : emailTemplates.wisePaymentConfirmed(contact.orgName),
    });
  }

  return NextResponse.json({ ok: true });
}
