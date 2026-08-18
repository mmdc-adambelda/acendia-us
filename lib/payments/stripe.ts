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
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured yet. Please contact us to complete signup." };
  }

  try {
    // Stripe's newer "Managed Payments" feature (default-on for accounts
    // created after it launched — found live, not documented in the SDK's
    // TypeScript types as of "stripe" 22.5.0 yet) is incompatible with
    // payment_intent_data.setup_future_usage: Stripe rejects the request
    // outright with a 400 if both are present. We need setup_future_usage
    // ("off_session") specifically so the card used for the setup fee can
    // be reused, without asking the client to pay again, for the delayed
    // monthly subscription — see createStripeDelayedSubscription below. So
    // this request explicitly opts OUT of Managed Payments rather than
    // dropping setup_future_usage, per Stripe's own error message. Cast is
    // narrow (just this one field) because the installed SDK's types don't
    // know about `managed_payments` yet, not a blanket type-check bypass.
    const sessionParams: Stripe.Checkout.SessionCreateParams & { managed_payments: { enabled: false } } = {
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
      managed_payments: { enabled: false },
    };
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("createStripeSetupFeeCheckoutSession failed", err);
    return { ok: false, error: "Could not start Stripe checkout. Please try again." };
  }
}

export type CreateAnonymousStripeSetupFeeCheckoutParams = {
  planId: string; // core plan id, stored in metadata so the return page knows what was purchased
  setupFeeCents: number;
  successUrl: string; // must include Stripe's {CHECKOUT_SESSION_ID} placeholder — see app/api/get-started/checkout/route.ts
  cancelUrl: string;
};

/**
 * Same real billing schedule as createStripeSetupFeeCheckoutSession (only
 * the one-time setup fee is charged today) but for the "pay first, tell us
 * who you are after" flow: no Acendia account exists yet at the moment
 * someone clicks "Join Now" on the homepage, so there's no
 * organizationId/userId to attach. The Stripe Checkout Session itself is
 * the only record of this purchase until the onboarding form (reached via
 * successUrl, which carries Stripe's own session ID) is submitted and
 * verified server-side — see app/api/get-started/complete/route.ts, which
 * re-retrieves this exact session from Stripe before creating anything,
 * never trusting a client-submitted "I paid" claim.
 */
export async function createAnonymousStripeSetupFeeCheckoutSession(
  params: CreateAnonymousStripeSetupFeeCheckoutParams,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured yet. Please contact us to get started." };
  }

  try {
    // See the long comment on createStripeSetupFeeCheckoutSession above for
    // why Managed Payments must be explicitly disabled here too.
    const sessionParams: Stripe.Checkout.SessionCreateParams & { managed_payments: { enabled: false } } = {
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
        metadata: { planId: params.planId, anonymousSignup: "true" },
      },
      customer_creation: "always",
      metadata: { planId: params.planId, anonymousSignup: "true" },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      managed_payments: { enabled: false },
    };
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("createAnonymousStripeSetupFeeCheckoutSession failed", err);
    return { ok: false, error: "Could not start Stripe checkout. Please try again." };
  }
}

/**
 * Re-fetches a Checkout Session from Stripe directly by ID — the ONLY
 * trustworthy way to know a payment actually succeeded for the anonymous
 * flow (there's no session/cookie/webhook-matched org to check against
 * yet). Returns null on any failure (not configured, bad ID, network
 * error) so callers degrade to an honest "we couldn't verify this" state
 * rather than ever assuming success.
 */
export async function retrieveStripeCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripeClient();
  if (!stripe) return null;
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
  } catch (err) {
    console.error("retrieveStripeCheckoutSession failed", err);
    return null;
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
