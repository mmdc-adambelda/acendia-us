import { NextRequest, NextResponse } from "next/server";
import { getActivePlans } from "@/lib/plans";
import { createAnonymousStripeSubscriptionCheckoutSession } from "@/lib/payments/stripe";
import { isRateLimited } from "@/lib/rateLimit";

/**
 * The "Join Now" homepage flow, start to finish: pay first, tell us who
 * you are after. This route needs no session — there's no Acendia account
 * yet at this point, by design (see app/api/get-started/complete/route.ts
 * for where the account actually gets created, only after a real payment
 * is verified).
 *
 * Plain HTML form target, not fetch() — same reasoning as
 * app/api/checkout/create/route.ts: a real top-level form submission is
 * far more resistant to a browser/extension silently withholding
 * anything than a JS fetch() call is.
 */
export async function POST(req: NextRequest) {
  const redirectHome = (error: string) => {
    const url = new URL("/", req.url);
    url.searchParams.set("get_started_error", error);
    return NextResponse.redirect(url, 303);
  };

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`get-started-checkout:${ip}`)) {
    return redirectHome("Too many requests. Try again shortly.");
  }

  const plans = await getActivePlans();
  const corePlan = plans.find((p) => p.plan_type === "core");
  if (!corePlan || !corePlan.stripe_price_id_monthly) {
    return redirectHome("Signup isn't available right now. Please contact us to get started.");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  // {CHECKOUT_SESSION_ID} is a literal Stripe placeholder — it substitutes
  // the real session ID into the URL Stripe redirects to after payment.
  // The thank-you page re-verifies that session directly against Stripe's
  // API before showing the onboarding form; nothing here is trusted on
  // the client's say-so.
  const result = await createAnonymousStripeSubscriptionCheckoutSession({
    planId: corePlan.id,
    priceId: corePlan.stripe_price_id_monthly,
    successUrl: `${appUrl}/get-started/thank-you/?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${appUrl}/`,
  });

  if (!result.ok) {
    return redirectHome(result.error);
  }
  return NextResponse.redirect(result.url, 303);
}
