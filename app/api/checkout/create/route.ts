import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStripeSetupFeeCheckoutSession } from "@/lib/payments/stripe";
import { createPaypalSubscription } from "@/lib/payments/paypal";
import { generateWiseReference, isWiseAvailable } from "@/lib/payments/wise";
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
 *
 * Deliberately a plain HTML form target (parses req.formData(), always
 * responds with a real redirect — 303, never JSON) instead of a fetch()-
 * driven JSON API. Found live: the previous fetch()-based version
 * intermittently failed to send the session cookie at all in one user's
 * real browser (reproducibly "Auth session missing!", empty cookie jar on
 * that specific request) despite the exact same session working correctly
 * for every normal page navigation, including the checkout page itself
 * loaded moments earlier — never reproduced in automated testing, most
 * likely a browser extension or privacy feature intercepting the fetch/XHR
 * specifically. A genuine top-level form submission is the one request
 * shape browsers and extensions essentially never withhold cookies from
 * without breaking the web generally, so this closes that entire class of
 * failure regardless of the exact mechanism on any given visitor's end.
 */
export async function POST(req: NextRequest) {
  // Error/Wise redirects deliberately stay on whatever host THIS request
  // actually arrived on (req.url), not a separately-configured canonical
  // URL — see the note further down by `appUrl` for why: this project's
  // own setup docs have NEXT_PUBLIC_APP_URL pointing at the bare apex
  // domain (acendia.us, no www), and forcing every redirect through that
  // is a real, live-unverified risk, not a proven fix. Staying on the
  // request's own host is what's actually been confirmed working in
  // repeated live testing.
  const redirectToCheckoutWithError = (message: string) => {
    const url = new URL("/checkout/", req.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, 303);
  };

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`checkout-create:${ip}`)) {
    return redirectToCheckoutWithError("Too many requests. Try again shortly.");
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectToCheckoutWithError("Invalid request. Please try again.");
  }
  const parsed = bodySchema.safeParse({ provider: formData.get("provider") });
  if (!parsed.success) {
    return redirectToCheckoutWithError("Please choose a payment method.");
  }
  const { provider } = parsed.data;

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return redirectToCheckoutWithError("Service unavailable. Please try again shortly.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirectToCheckoutWithError("Please log in first.");
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    return redirectToCheckoutWithError("No business account found for your login.");
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
    return redirectToCheckoutWithError("No plan selection found. Please contact us to complete signup.");
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
    return redirectToCheckoutWithError("Selected plan is no longer available.");
  }

  const setupFeeCents = plans.reduce((sum, p) => sum + (p.setup_fee_cents ?? 0), 0);
  const corePlan = plans.find((p) => p.id === requestedPlanId) ?? plans[0];

  // Only needed for Stripe/PayPal's success/cancel URLs below — those go
  // to external providers and must be absolute, so NEXT_PUBLIC_APP_URL is
  // the right source there (Stripe/PayPal don't care which of our own
  // domains it is). Everything that redirects back to OUR OWN pages in
  // this route (errors, Wise) deliberately uses req.url instead — see the
  // note on redirectToCheckoutWithError above.
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
      return redirectToCheckoutWithError("Could not start checkout. Please try again.");
    }
    subscriptionId = newSub.id;
  } else {
    await admin.from("subscriptions").update({ payment_provider: provider }).eq("id", subscriptionId);
  }

  if (provider === "stripe") {
    const priceIds = plans.map((p) => p.stripe_price_id_monthly).filter((id): id is string => Boolean(id));
    if (priceIds.length !== plans.length) {
      return redirectToCheckoutWithError(
        "Card payment isn't fully configured for your plan yet. Please try PayPal or Wise, or contact us.",
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
    if (!result.ok) return redirectToCheckoutWithError(result.error);
    return NextResponse.redirect(result.url, 303);
  }

  if (provider === "paypal") {
    if (!corePlan.paypal_plan_id_monthly) {
      return redirectToCheckoutWithError(
        "PayPal isn't fully configured for your plan yet. Please try card payment or Wise, or contact us.",
      );
    }
    const result = await createPaypalSubscription({
      planId: corePlan.paypal_plan_id_monthly,
      organizationId,
      userId: user.id,
      returnUrl: `${appUrl}/checkout/success/`,
      cancelUrl: `${appUrl}/checkout/cancel/`,
    });
    if (!result.ok) return redirectToCheckoutWithError(result.error);
    return NextResponse.redirect(result.approvalUrl, 303);
  }

  // wise — manual pending-payment flow, never auto-activates. Only the
  // setup fee is collected today, same schedule as Stripe/PayPal: the
  // first monthly payment is a SEPARATE Wise invoice staff creates from
  // /admin/clients once the site's real go-live date is recorded (see
  // app/api/admin/subscriptions/mark-live), never bundled with setup.
  if (!isWiseAvailable()) {
    return redirectToCheckoutWithError("Wise payment isn't configured yet. Please contact us.");
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

  // Wise has no external checkout page to redirect to — /checkout/wise/
  // re-reads the just-written pending payment row server-side and renders
  // the reference/payment-link confirmation there.
  return NextResponse.redirect(new URL("/checkout/wise/", req.url), 303);
}
