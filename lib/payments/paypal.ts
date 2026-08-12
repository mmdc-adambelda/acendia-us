import "server-only";
import { estimateDefaultBillingStart } from "@/lib/billing";

/**
 * PayPal Subscriptions API client using plain fetch() — no SDK dependency.
 * All functions are try/catch wrapped and return a discriminated result
 * rather than throwing, so a misconfigured/unreachable PayPal never takes
 * down a page that merely offers it as a checkout option.
 */

function paypalBaseUrl(): string {
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function isPaypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getPaypalAccessToken(): Promise<string | null> {
  if (!isPaypalConfigured()) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }
  try {
    const basicAuth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    ).toString("base64");
    const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) {
      console.error("PayPal OAuth token request failed", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as { access_token: string; expires_in: number };
    cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
    return data.access_token;
  } catch (err) {
    console.error("getPaypalAccessToken failed", err);
    return null;
  }
}

export type CreatePaypalSubscriptionParams = {
  planId: string; // PayPal Plan ID (paypal_plan_id_monthly on our plans table)
  organizationId: string;
  userId: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createPaypalSubscription(
  params: CreatePaypalSubscriptionParams,
): Promise<{ ok: true; approvalUrl: string } | { ok: false; error: string }> {
  const token = await getPaypalAccessToken();
  if (!token) {
    return { ok: false, error: "PayPal is not configured yet. Please contact us to complete signup." };
  }
  try {
    const res = await fetch(`${paypalBaseUrl()}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        plan_id: params.planId,
        custom_id: params.organizationId,
        // Real Acendia billing schedule: the client pays the one-time setup
        // fee separately at checkout (see the "wise"/"stripe" branches in
        // app/api/checkout/create) — this PayPal *recurring* plan should
        // only cover the monthly amount, and start_time delays its first
        // charge to the same estimated date used for Stripe (see
        // lib/billing.ts). PayPal doesn't support moving this date once
        // the subscription exists, so unlike Stripe this is a one-shot
        // estimate — see CLIENT-PORTAL-SETUP.md Part 3 for the
        // recommended PayPal Plan configuration (a $0 trial cycle to cover
        // this gap) so a mistimed estimate never double-bills the client.
        start_time: estimateDefaultBillingStart().toISOString(),
        application_context: {
          brand_name: "Acendia International",
          user_action: "SUBSCRIBE_NOW",
          return_url: params.returnUrl,
          cancel_url: params.cancelUrl,
        },
      }),
    });
    if (!res.ok) {
      console.error("PayPal create subscription failed", res.status, await res.text());
      return { ok: false, error: "Could not start PayPal checkout. Please try again." };
    }
    const data = (await res.json()) as { links: { rel: string; href: string }[] };
    const approve = data.links.find((l) => l.rel === "approve");
    if (!approve) {
      return { ok: false, error: "PayPal did not return an approval link." };
    }
    return { ok: true, approvalUrl: approve.href };
  } catch (err) {
    console.error("createPaypalSubscription failed", err);
    return { ok: false, error: "Could not start PayPal checkout. Please try again." };
  }
}

export async function getPaypalSubscription(subscriptionId: string): Promise<Record<string, unknown> | null> {
  const token = await getPaypalAccessToken();
  if (!token) return null;
  try {
    const res = await fetch(`${paypalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch (err) {
    console.error("getPaypalSubscription failed", err);
    return null;
  }
}

/**
 * Verifies a PayPal webhook signature via PayPal's verify-webhook-signature
 * API (PayPal doesn't support local HMAC verification the way Stripe does).
 * Returns false (never throws) on any failure or missing config.
 */
export async function verifyPaypalWebhookSignature(params: {
  headers: Headers;
  body: unknown;
}): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const token = await getPaypalAccessToken();
  if (!webhookId || !token) return false;
  try {
    const res = await fetch(`${paypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_algo: params.headers.get("paypal-auth-algo"),
        cert_url: params.headers.get("paypal-cert-url"),
        transmission_id: params.headers.get("paypal-transmission-id"),
        transmission_sig: params.headers.get("paypal-transmission-sig"),
        transmission_time: params.headers.get("paypal-transmission-time"),
        webhook_id: webhookId,
        webhook_event: params.body,
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { verification_status: string };
    return data.verification_status === "SUCCESS";
  } catch (err) {
    console.error("verifyPaypalWebhookSignature failed", err);
    return false;
  }
}
