// Real Acendia billing schedule (confirmed by the owner, not fabricated):
//
//   Day 0   — client pays the one-time SETUP FEE at checkout. Nothing else
//             is charged that day.
//   Day ~3  — website typically goes live (2-3 business days after setup
//             payment is the normal turnaround; this varies per client).
//   Day ~17 — first MONTHLY charge, exactly 14 days after the site actually
//             goes live (not 14 days after payment).
//
// The exact go-live date isn't known at checkout time, so new
// subscriptions are created with a conservative estimated delay (see
// DEFAULT_FIRST_BILLING_DELAY_DAYS below). Once staff records the real
// go-live date in /admin (see app/api/admin/subscriptions/mark-live),
// the subscription's actual first-charge date is corrected to exactly 14
// days after that real date — see lib/payments/stripe.ts's
// updateStripeSubscriptionTrialEnd().

export const POST_GOLIVE_BILLING_DELAY_DAYS = 14;

// Conservative placeholder used only until the real go-live date is known.
// 3 business days of build time, padded to 5 calendar days to absorb a
// weekend, plus the 14-day post-go-live delay = 19 days. This is an
// estimate shown to the client at checkout ("billing starts ~19 days
// after signup, exact date confirmed once your site is live") — it is
// always corrected to the exact date once staff marks the site live.
export const DEFAULT_FIRST_BILLING_DELAY_DAYS = 19;

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** The real, authoritative first-billing date once a go-live date is known. */
export function computeBillingStartFromGoLive(goLiveDate: Date): Date {
  return addDays(goLiveDate, POST_GOLIVE_BILLING_DELAY_DAYS);
}

/** The estimated first-billing date shown at checkout, before go-live is known. */
export function estimateDefaultBillingStart(from: Date = new Date()): Date {
  return addDays(from, DEFAULT_FIRST_BILLING_DELAY_DAYS);
}
