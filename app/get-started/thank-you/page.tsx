import type { Metadata } from "next";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { retrieveStripeCheckoutSession } from "@/lib/payments/stripe";
import { US_STATES } from "@/lib/validation/getStarted";

export const metadata: Metadata = buildMetadata({
  title: "You're In — Tell Us About Your Business",
  description: "Payment received. Tell us about your business so we can get started.",
  path: "/get-started/thank-you/",
  noIndex: true,
});

/**
 * Reached only via Stripe's own success_url redirect (see
 * app/api/get-started/checkout/route.ts), carrying Stripe's real
 * ?session_id=. Re-verifies that session directly against Stripe's API
 * server-side before ever showing the onboarding form — a URL alone is
 * never trusted as proof of payment (anyone could type a fake one), per
 * CLIENT-PORTAL-IMPLEMENTATION.md's "never trust the success URL alone"
 * rule already established for the logged-in checkout flow.
 */
export default async function GetStartedThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; error?: string }>;
}) {
  const { session_id: sessionId, error: errorMessage } = await searchParams;

  const session = sessionId ? await retrieveStripeCheckoutSession(sessionId) : null;
  const isPaid = session?.payment_status === "paid" && session?.mode === "payment";
  const email = session?.customer_details?.email ?? "";

  if (!isPaid) {
    return (
      <div className="flex min-h-screen items-center justify-center py-20">
        <Container className="max-w-lg text-center">
          <Card>
            <h1 className="text-xl font-semibold text-white">We couldn&apos;t verify your payment</h1>
            <p className="mt-3 text-sm text-white/60">
              If you just paid and landed here, this page may have loaded before Stripe finished confirming — try
              refreshing in a moment. If the problem continues, please{" "}
              <a href="/contact/" className="underline hover:text-white">
                contact us
              </a>{" "}
              and we&apos;ll sort it out directly.
            </p>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-14 sm:py-20">
      <Container className="max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Payment received — let&apos;s get started
        </h1>
        <p className="mt-3 text-sm text-white/60">
          Tell us about your business so we can start building your site and SEO campaign. We&apos;ll email you a
          link to set your portal password once this is submitted.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mt-6 whitespace-pre-line rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <form method="POST" action="/api/get-started/complete" className="mt-8 space-y-5">
          <input type="hidden" name="sessionId" value={sessionId} />

          <Field label="Business Name" name="businessName" required />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Primary Contact Name" name="contactName" required />
            <Field label="Phone Number" name="phone" type="tel" required />
          </div>
          <Field label="Email Address" name="email" type="email" required defaultValue={email} />
          <Field label="Website URL (if existing)" name="websiteUrl" type="url" placeholder="https://" />
          <Field label="Street Address" name="address" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="City" name="city" required />
            <Select label="State" name="state" options={US_STATES} required />
            <Field label="ZIP" name="zip" />
          </div>
          <Field label="Primary Service / Industry" name="primaryService" required placeholder="e.g. Roofing, Legal, Healthcare" />
          <Field label="Keywords you want to rank for" name="keywords" placeholder="Comma separated" />
          <Field label="Competitors you want to outrank" name="competitors" placeholder="Comma separated" />
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-white/80">
              Notes / Special Requirements
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            className="focus-ring w-full rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Submit &amp; Get Started
          </button>
        </form>
      </Container>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
