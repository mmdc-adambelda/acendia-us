import "server-only";

/**
 * Wise has no equivalent to Stripe/PayPal's automated recurring billing +
 * webhook confirmation. What we build here is the honest version of that
 * limitation: a unique payment reference the client is asked to include
 * when they pay via a Wise payment link, recorded as a "pending" payment
 * that only becomes "succeeded" once a staff/admin user manually confirms
 * the transfer arrived (see app/admin/payments). This must never be
 * presented to the client as equivalent to instant/automatic activation.
 */

export function isWiseAvailable(): boolean {
  return Boolean(process.env.WISE_PAYMENT_LINK);
}

export function getWisePaymentLink(): string | null {
  return process.env.WISE_PAYMENT_LINK ?? null;
}

export function generateWiseReference(organizationId: string): string {
  const shortOrgId = organizationId.replace(/-/g, "").slice(0, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `ACND-${shortOrgId}-${timestamp}`;
}
