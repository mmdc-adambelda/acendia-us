import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStripeSetupFeeCheckoutSession } from "@/lib/payments/stripe";
import { createPaypalSubscription } from "@/lib/payments/paypal";
import { generateWiseReference, getWisePaymentLink, isWiseAvailable } from "@/lib/payments/wise";
import { isRateLimited } from "@/lib/rateLimit";

const bodySchema = z.object({
  provider: z.enum(["stripe", "paypal", "wise"]),
});

/**
 * Creates a checkout attempt for the signed-in user's organization. This is
 * the ONLY place a price is ever decided — always read from the `plans`
 * table server-side, never trusted from the request body. Never activates
 * anything itself: it only starts a provider checkout/subscription flow (or,
 * for Wise, generates a pending manual-payment record). Real activation only
 * happens from a verified webhook (Stripe/PayPal) or an admin confirmation
 * (Wise) — see app/api/webhooks/*.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`checkout-create:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid checkout request." }, { status: 422 });
  }
  const { provider } = parsed.data;

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return NextResponse.json({ ok: false, error: "Service unavailable. Please try again shortly." }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user) {
    // TEMP DIAGNOSTIC — remove once root cause is found. The checkout
    // PAGE (a Server Component) sees the session fine right before this;
    // this route (a Route Handler) using the same createClient() doesn't,
    // which shouldn't be possible without a real reason.
    return NextResponse.json(
      {
        ok: false,
        error: "Please log in first.",
        debug: userError ? { message: userError.message, status: userError.status, code: userError.code } : "no error object, user just null",
      },
      { status: 401 }
    );
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ ok: false, error: "No business account found for your login." }, { status: 404 });
  }
  const organizationId = membership.organization_id;

  // Pull the plan selection captured during registration (see
  // app/api/register/complete/route.ts). Falls back to the core plan alone
  // if none was recorded.
  const admin = createAdminClient();
  const { data: goalsLog } = await admin
    .from("activity_logs")
    .select("metadata")
    .eq("organization_id", organizationId)
    .eq("action", "registration_goals_captured")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const requestedPlanId = (goalsLog?.metadata as Record<string, unknown> | undefined)?.requestedPlanId as
    | string
    | undefined;
  const addonPlanIds =
    ((goalsLog?.metadata as Record<string, unknown> | undefined)?.addonPlanIds as string[] | undefined) ?? [];

  if (!requestedPlanId) {
    return NextResponse.json(
      { ok: false, error: "No plan selection found. Please contact us to complete signup." },
      { status: 422 },
    );
  }

  const planIds = [requestedPlanId, ...addonPlanIds];
  const { data: plans, error: plansError } = await admin
    .from("plans")
    .select(
      "id, name, setup_fee_cents, monthly_price_cents, stripe_price_id_monthly, paypal_plan_id_monthly, wise_available",
    )
    .in("id", planIds)
    .eq("is_active", true);

  if (plansError || !plans || plans.length === 0) {
    return NextResponse.json({ ok: false, error: "Selected plan is no longer available." }, { status: 422 });
  }

  const setupFeeCents = plans.reduce((sum, p) => sum + (p.setup_fee_cents ?? 0), 0);
  const corePlan = plans.find((p) => p.id === requestedPlanId) ?? plans[0];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;

  // Create (or reuse) a pending subscription row so there's always a real
  // DB record to attach the payment/webhook confirmation to.
  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id, status")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let subscriptionId = existingSub?.id;
  if (!subscriptionId || existingSub?.status === "cancelled" || existingSub?.status === "expired") {
    const { data: newSub, error: subError } = await admin
      .from("subscriptions")
      .insert({
        organization_id: organizationId,
        plan_id: corePlan.id,
        billing_cycle: "monthly",
        payment_provider: provider,
        status: "pending",
      })
      .select("id")
      .single();
    if (subError || !newSub) {
      console.error("Failed to create pending subscription", subError);
      return NextResponse.json({ ok: false, error: "Could not start checkout. Please try again." }, { status: 500 });
    }
    subscriptionId = newSub.id;
  } else {
    await admin.from("subscriptions").update({ payment_provider: provider }).eq("id", subscriptionId);
  }

  if (provider === "stripe") {
    const priceIds = plans.map((p) => p.stripe_price_id_monthly).filter((id): id is string => Boolean(id));
    if (priceIds.length !== plans.length) {
      return NextResponse.json(
        { ok: false, error: "Card payment isn't fully configured for your plan yet. Please try PayPal or Wise, or contact us." },
        { status: 422 },
      );
    }
    // Only the setup fee is charged today — the recurring monthly
    // subscription is created by the webhook once this payment succeeds,
    // with its first charge delayed to ~14 days after go-live. See
    // lib/billing.ts and app/api/webhooks/stripe/route.ts.
    const result = await createStripeSetupFeeCheckoutSession({
      organizationId,
      userId: user.id,
      userEmail: user.email ?? "",
      planId: corePlan.id,
      addonPlanIds: addonPlanIds.filter((id) => id !== corePlan.id),
      setupFeeCents,
      successUrl: `${appUrl}/checkout/success/`,
      cancelUrl: `${appUrl}/checkout/cancel/`,
    });
    if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    return NextResponse.json({ ok: true, redirectUrl: result.url });
  }

  if (provider === "paypal") {
    if (!corePlan.paypal_plan_id_monthly) {
      return NextResponse.json(
        { ok: false, error: "PayPal isn't fully configured for your plan yet. Please try card payment or Wise, or contact us." },
        { status: 422 },
      );
    }
    const result = await createPaypalSubscription({
      planId: corePlan.paypal_plan_id_monthly,
      organizationId,
      userId: user.id,
      returnUrl: `${appUrl}/checkout/success/`,
      cancelUrl: `${appUrl}/checkout/cancel/`,
    });
    if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    return NextResponse.json({ ok: true, redirectUrl: result.approvalUrl });
  }

  // wise — manual pending-payment flow, never auto-activates. Only the
  // setup fee is collected today, same schedule as Stripe/PayPal: the
  // first monthly payment is a SEPARATE Wise invoice staff creates from
  // /admin/clients once the site's real go-live date is recorded (see
  // app/api/admin/subscriptions/mark-live), never bundled with setup.
  if (!isWiseAvailable()) {
    return NextResponse.json({ ok: false, error: "Wise payment isn't configured yet. Please contact us." }, { status: 422 });
  }
  const reference = generateWiseReference(organizationId);
  await admin.from("subscriptions").update({ wise_reference: reference }).eq("id", subscriptionId);
  await admin.from("payments").insert({
    organization_id: organizationId,
    subscription_id: subscriptionId,
    payment_provider: "wise",
    status: "pending",
    amount_cents: setupFeeCents,
    currency: "usd",
    wise_reference: reference,
    description: `One-time setup fee — ${plans.map((p) => p.name).join(" + ")}`,
  });
  await admin.from("activity_logs").insert({
    organization_id: organizationId,
    actor_id: user.id,
    action: "wise_payment_pending_created",
    metadata: { reference, amountCents: setupFeeCents },
  });

  return NextResponse.json({
    ok: true,
    provider: "wise",
    reference,
    paymentLink: getWisePaymentLink(),
    amountCents: setupFeeCents,
  });
}
