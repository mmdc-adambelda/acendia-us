import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateStripeSubscriptionTrialEnd } from "@/lib/payments/stripe";
import { generateWiseReference } from "@/lib/payments/wise";
import { computeBillingStartFromGoLive } from "@/lib/billing";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

const bodySchema = z.object({
  organizationId: z.string().uuid(),
  goLiveDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: "Invalid date" }),
});

/**
 * Records the client's REAL go-live date and corrects their first-billing
 * date to exactly 14 days after it (see lib/billing.ts) — this is what
 * turns the checkout-time estimate into the real, contractual date.
 *
 *   - Stripe: updates the existing subscription's trial_end via the API —
 *     the client is never re-charged or re-approved, the date just moves.
 *   - PayPal: PayPal doesn't support moving an existing subscription's
 *     start date once created, so this only corrects our own records —
 *     the actual first PayPal charge stays on the estimate set at
 *     checkout. Flagged in the response so staff know to watch for it.
 *   - Wise: generates the NEXT pending invoice (the first monthly
 *     payment) for staff to send the client near the real billing date,
 *     since Wise has no automated recurring billing at all.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { data: callerProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!callerProfile || !["staff", "admin", "super_admin"].includes(callerProfile.role)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please provide a valid go-live date." }, { status: 422 });
  }
  const { organizationId, goLiveDate } = parsed.data;
  const goLive = new Date(goLiveDate);
  const billingStart = computeBillingStartFromGoLive(goLive);

  const admin = createAdminClient();

  const { data: website } = await admin
    .from("websites")
    .select("id")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();
  if (website) {
    await admin.from("websites").update({ went_live_at: goLive.toISOString() }).eq("id", website.id);
  }

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, plan_id, payment_provider, stripe_subscription_id")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let providerNote: string | null = null;

  if (subscription) {
    if (subscription.payment_provider === "stripe" && subscription.stripe_subscription_id) {
      const result = await updateStripeSubscriptionTrialEnd(subscription.stripe_subscription_id, billingStart);
      if (!result.ok) {
        providerNote = `Stripe update failed: ${result.error}. Correct the trial end manually in the Stripe Dashboard.`;
      }
      await admin
        .from("subscriptions")
        .update({ current_period_end: billingStart.toISOString() })
        .eq("id", subscription.id);
    } else if (subscription.payment_provider === "paypal") {
      providerNote =
        "PayPal doesn't support moving an already-created subscription's start date — the client's first PayPal charge stays on the date estimated at checkout. Contact them directly if that date is significantly wrong.";
      await admin
        .from("subscriptions")
        .update({ current_period_end: billingStart.toISOString() })
        .eq("id", subscription.id);
    } else if (subscription.payment_provider === "wise") {
      // Compute the real monthly total from the plan selected at
      // registration (core + any addons), same lookup pattern used in
      // app/api/checkout/create/route.ts.
      const { data: goalsLog } = await admin
        .from("activity_logs")
        .select("metadata")
        .eq("organization_id", organizationId)
        .eq("action", "registration_goals_captured")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const addonPlanIds =
        ((goalsLog?.metadata as Record<string, unknown> | undefined)?.addonPlanIds as string[] | undefined) ?? [];
      const { data: plans } = await admin
        .from("plans")
        .select("id, name, monthly_price_cents")
        .in("id", [subscription.plan_id, ...addonPlanIds]);
      const monthlyTotalCents = (plans ?? []).reduce((sum, p) => sum + (p.monthly_price_cents ?? 0), 0);

      const reference = generateWiseReference(organizationId);
      await admin.from("payments").insert({
        organization_id: organizationId,
        subscription_id: subscription.id,
        payment_provider: "wise",
        status: "pending",
        amount_cents: monthlyTotalCents,
        currency: "usd",
        wise_reference: reference,
        description: `Monthly subscription payment — due ${billingStart.toISOString().slice(0, 10)}`,
      });
      await admin
        .from("subscriptions")
        .update({ current_period_end: billingStart.toISOString() })
        .eq("id", subscription.id);
      providerNote = `Wise invoice created for ${(monthlyTotalCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}, reference ${reference} — send this to the client ahead of ${billingStart.toDateString()}.`;
    }
  }

  await admin.from("activity_logs").insert({
    organization_id: organizationId,
    actor_id: user.id,
    action: "site_marked_live",
    metadata: { goLiveDate: goLive.toISOString(), billingStart: billingStart.toISOString() },
  });

  await notifyOrganization({
    organizationId,
    type: "site_live",
    title: "Your site is live!",
    body: `Your monthly plan starts billing on ${billingStart.toDateString()}.`,
    linkUrl: "/portal/billing/",
  });
  const contact = await getOrgContactInfo(organizationId);
  if (contact?.email) {
    await sendEmail({
      to: contact.email,
      subject: "Your site is live — here's when billing starts",
      html: emailTemplates.monthlyBillingScheduled(contact.orgName, billingStart.toDateString()),
    });
  }

  return NextResponse.json({ ok: true, billingStart: billingStart.toISOString(), providerNote });
}
