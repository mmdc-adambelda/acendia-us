import "server-only";
import Stripe from "stripe";
import { estimateDefaultBillingStart } from "@/lib/billing";

let cachedClient: Stripe | null = null;

/**
 * Lazily-created Stripe client. Returns null (never throws) when
 * STRIPE_SECRET_KEY isn't set, so callers can degrade gracefully instead
 * of crashing pages that merely mention Stripe as an option.
 */
export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cachedClient) {
    cachedClient = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  }
  return cachedClient;
}

export type CreateStripeSetupFeeCheckoutParams = {
  organizationId: string;
  userId: string;
  userEmail: string;
  planId: string; // core plan id — the recurring subscription is created after this payment succeeds
  addonPlanIds: string[];
  setupFeeCents: number; // the ONLY thing charged today
  successUrl: string;
  cancelUrl: string;
};

/**
 * Real Acendia billing schedule: the client pays only the one-time setup
 * fee today. The recurring monthly subscription is created separately
 * (see createStripeDelayedSubscription below) once this payment succeeds,
 * with its first charge delayed until ~14 days after the client's site
 * actually goes live — never charged alongside setup. See lib/billing.ts.
 *
 * mode: "payment" (not "subscription") — this is a one-time charge, not a
 * recurring one. setup_future_usage saves the card so the later
 * subscription can be created off-session without asking the client to
 * pay again.
 */
export async function createStripeSetupFeeCheckoutSession(
  params: CreateStripeSetupFeeCheckoutParams,
): Promise<{ ok: true; url: string } | { ok: false; error: string; debug?: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured yet. Please contact us to complete signup." };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: params.setupFeeCents,
            product_data: {
              name: "Acendia one-time setup fee",
              description: "Monthly billing starts separately, ~14 days after your site goes live.",
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
        metadata: { organizationId: params.organizationId, userId: params.userId },
      },
      customer_email: params.userEmail,
      customer_creation: "always",
      client_reference_id: params.organizationId,
      metadata: {
        organizationId: params.organizationId,
        userId: params.userId,
        planId: params.planId,
        addonPlanIds: params.addonPlanIds.join(","),
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("createStripeSetupFeeCheckoutSession failed", err);
    // TEMP DIAGNOSTIC: include the raw Stripe error message so this can be
    // read from the API response without log access. Remove once resolved.
    const debug = err instanceof Stripe.errors.StripeError ? `${err.type}: ${err.message}` : err instanceof Error ? err.message : String(err);
    return { ok: false, error: "Could not start Stripe checkout. Please try again.", debug };
  }
}

export type CreateStripeDelayedSubscriptionParams = {
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  priceIds: string[]; // recurring monthly Stripe Price IDs (core plan + addons)
  organizationId: string;
  userId: string;
};

/**
 * Creates the recurring subscription right after the setup-fee payment
 * succeeds, but with trial_end set to the estimated first-billing date
 * (see lib/billing.ts) so Stripe doesn't actually charge anything until
 * then. Status will read "trialing" until that date, then Stripe
 * auto-transitions it to "active" and generates the first real invoice —
 * see app/api/webhooks/stripe/route.ts. Once staff confirms the real
 * go-live date, updateStripeSubscriptionTrialEnd() corrects this date.
 */
export async function createStripeDelayedSubscription(
  params: CreateStripeDelayedSubscriptionParams,
): Promise<{ ok: true; subscription: Stripe.Subscription } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured." };
  }
  try {
    await stripe.paymentMethods.attach(params.stripePaymentMethodId, { customer: params.stripeCustomerId });
    await stripe.customers.update(params.stripeCustomerId, {
      invoice_settings: { default_payment_method: params.stripePaymentMethodId },
    });

    const trialEndUnix = Math.floor(estimateDefaultBillingStart().getTime() / 1000);

    const subscription = await stripe.subscriptions.create({
      customer: params.stripeCustomerId,
      items: params.priceIds.map((price) => ({ price })),
      trial_end: trialEndUnix,
      default_payment_method: params.stripePaymentMethodId,
      metadata: { organizationId: params.organizationId, userId: params.userId },
    });

    return { ok: true, subscription };
  } catch (err) {
    console.error("createStripeDelayedSubscription failed", err);
    return { ok: false, error: "Could not schedule the monthly subscription." };
  }
}

/**
 * Corrects a subscription's first-charge date to exactly 14 days after
 * the client's REAL go-live date, once staff records it — see
 * app/api/admin/subscriptions/mark-live/route.ts. proration_behavior:
 * "none" because nothing should be charged/credited just for moving the
 * trial boundary.
 */
export async function updateStripeSubscriptionTrialEnd(
  stripeSubscriptionId: string,
  trialEndDate: Date,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured." };
  }
  try {
    await stripe.subscriptions.update(stripeSubscriptionId, {
      trial_end: Math.floor(trialEndDate.getTime() / 1000),
      proration_behavior: "none",
    });
    return { ok: true };
  } catch (err) {
    console.error("updateStripeSubscriptionTrialEnd failed", err);
    return { ok: false, error: "Could not update the subscription's billing date in Stripe." };
  }
}

export async function createStripeCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured." };
  }
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("createStripeCustomerPortalSession failed", err);
    return { ok: false, error: "Could not open billing portal." };
  }
}

/**
 * Verifies and parses an incoming Stripe webhook payload. Returns null
 * (never throws) on missing config or bad signature — the route handler
 * is responsible for responding with an appropriate status code.
 */
export function constructStripeWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event | null {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) return null;
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return null;
  }
}
