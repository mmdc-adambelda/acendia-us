import "server-only";
import Stripe from "stripe";

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

export type CreateStripeCheckoutParams = {
  organizationId: string;
  userId: string;
  userEmail: string;
  priceIds: string[]; // one or more recurring Stripe Price IDs (core plan + addons)
  setupFeeCents: number; // one-time setup fee, added as an ad-hoc line item
  successUrl: string;
  cancelUrl: string;
};

export async function createStripeCheckoutSession(
  params: CreateStripeCheckoutParams,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured yet. Please contact us to complete signup." };
  }

  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.priceIds.map((price) => ({
      price,
      quantity: 1,
    }));

    if (params.setupFeeCents > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          unit_amount: params.setupFeeCents,
          product_data: { name: "One-time setup fee" },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      customer_email: params.userEmail,
      client_reference_id: params.organizationId,
      subscription_data: {
        metadata: { organizationId: params.organizationId, userId: params.userId },
      },
      metadata: { organizationId: params.organizationId, userId: params.userId },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    console.error("createStripeCheckoutSession failed", err);
    return { ok: false, error: "Could not start Stripe checkout. Please try again." };
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
