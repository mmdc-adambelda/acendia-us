import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateWiseReference, isWiseAvailable, getWisePaymentLink } from "@/lib/payments/wise";
import { isProviderConfigured } from "@/lib/payments/types";

const ORIGINAL_ENV = { ...process.env };

function resetEnv() {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.PAYPAL_CLIENT_ID;
  delete process.env.PAYPAL_CLIENT_SECRET;
  delete process.env.WISE_PAYMENT_LINK;
}

describe("lib/payments/wise", () => {
  beforeEach(resetEnv);
  afterEach(resetEnv);

  it("generates a unique, prefixed, uppercase reference from an organization id", () => {
    const ref = generateWiseReference("11111111-2222-3333-4444-555555555555");
    expect(ref).toMatch(/^ACND-[0-9A-F]{8}-[0-9A-Z]+$/);
  });

  it("embeds a different, later timestamp segment when called again", () => {
    const a = generateWiseReference("11111111-2222-3333-4444-555555555555");
    const timestampA = a.split("-")[2];
    // Advance real time slightly so the timestamp segment is guaranteed to
    // differ — Date.now() has millisecond resolution.
    const start = Date.now();
    while (Date.now() === start) {
      /* busy-wait under 1ms */
    }
    const b = generateWiseReference("11111111-2222-3333-4444-555555555555");
    const timestampB = b.split("-")[2];
    expect(timestampB).not.toBe(timestampA);
  });

  it("reports Wise unavailable with no payment link configured", () => {
    expect(isWiseAvailable()).toBe(false);
    expect(getWisePaymentLink()).toBeNull();
  });

  it("reports Wise available once WISE_PAYMENT_LINK is set", () => {
    process.env.WISE_PAYMENT_LINK = "https://wise.example/pay/acendia";
    expect(isWiseAvailable()).toBe(true);
    expect(getWisePaymentLink()).toBe("https://wise.example/pay/acendia");
  });
});

describe("lib/payments/types isProviderConfigured", () => {
  beforeEach(resetEnv);
  afterEach(resetEnv);

  it("is false for every provider with no env vars set", () => {
    expect(isProviderConfigured("stripe")).toBe(false);
    expect(isProviderConfigured("paypal")).toBe(false);
    expect(isProviderConfigured("wise")).toBe(false);
  });

  it("flips true per-provider only once its required env vars are set", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    expect(isProviderConfigured("stripe")).toBe(true);
    expect(isProviderConfigured("paypal")).toBe(false);

    process.env.PAYPAL_CLIENT_ID = "id";
    expect(isProviderConfigured("paypal")).toBe(false); // secret still missing
    process.env.PAYPAL_CLIENT_SECRET = "secret";
    expect(isProviderConfigured("paypal")).toBe(true);
  });
});
