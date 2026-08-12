export type PaymentProvider = "stripe" | "paypal" | "wise";

export type BillingCycle = "monthly" | "quarterly" | "annual";

export type CheckoutRequest = {
  organizationId: string;
  userId: string;
  planId: string;
  addonPlanIds: string[];
  billingCycle: BillingCycle;
};

export type CheckoutResult =
  | { ok: true; redirectUrl: string; provider: PaymentProvider }
  | { ok: true; provider: "wise"; reference: string; paymentLink: string | null; amountCents: number }
  | { ok: false; error: string };

/**
 * Whether a given provider is actually usable right now (has the required
 * env vars set). Checkout UI uses this to show/hide each option rather
 * than offering a payment method that will just fail.
 */
export function isProviderConfigured(provider: PaymentProvider): boolean {
  switch (provider) {
    case "stripe":
      return Boolean(process.env.STRIPE_SECRET_KEY);
    case "paypal":
      return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
    case "wise":
      // Wise never requires API access to be "usable" — the manual
      // payment-link + admin-confirmation flow works with just a payment
      // link configured. See lib/payments/wise.ts.
      return Boolean(process.env.WISE_PAYMENT_LINK);
  }
}
