"use client";

import { useState } from "react";
import type { PaymentProvider } from "@/lib/payments/types";

type Props = {
  availableProviders: { provider: PaymentProvider; label: string; description: string }[];
  planSummary: { name: string; setupFeeCents: number; monthlyPriceCents: number }[];
  errorMessage: string | null;
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Deliberately a plain <form method="POST" action="/api/checkout/create">,
 * not a fetch()-driven submit handler — see the long comment in
 * app/api/checkout/create/route.ts for why. The only client-side state
 * here is which radio is selected (for the highlighted-border styling);
 * submission itself is a real browser form POST, so there's no
 * loading/error state to manage in JS anymore either — /checkout/?error=
 * (rendered server-side by the parent page) covers that instead.
 */
export default function CheckoutClient({ availableProviders, planSummary, errorMessage }: Props) {
  const [selected, setSelected] = useState<PaymentProvider | null>(availableProviders[0]?.provider ?? null);

  const totalSetup = planSummary.reduce((s, p) => s + p.setupFeeCents, 0);
  const totalMonthly = planSummary.reduce((s, p) => s + p.monthlyPriceCents, 0);

  return (
    <form method="POST" action="/api/checkout/create" className="rounded-[var(--r-md)] border border-[var(--border-dim)] bg-white/[0.03] p-6">
      <h2 className="text-lg font-semibold text-white">Order summary</h2>
      <ul className="mt-3 space-y-1 text-sm text-white/70">
        {planSummary.map((p) => (
          <li key={p.name} className="flex justify-between">
            <span>{p.name}</span>
            <span>{formatCents(p.monthlyPriceCents)}/mo</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-[var(--border-dim)] pt-4 text-sm">
        <div className="flex justify-between font-semibold">
          <dt className="text-white">Due today (setup only)</dt>
          <dd className="text-white">{formatCents(totalSetup)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-white/50">Then, starting 14 days after go-live</dt>
          <dd className="text-white/70">{formatCents(totalMonthly)}/mo</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-white/40">
        Your site typically goes live within 2-3 business days. You&apos;re not charged your monthly plan until 14
        days after that — never today, and never bundled with the setup fee.
      </p>

      <h3 className="mt-6 text-sm font-semibold text-white">Choose a payment method</h3>
      <div className="mt-3 space-y-2">
        {availableProviders.map((p) => (
          <label
            key={p.provider}
            className={`focus-ring flex cursor-pointer items-start gap-3 rounded-[var(--r-sm)] border p-3 transition-colors ${
              selected === p.provider ? "border-white/40 bg-white/[0.06]" : "border-[var(--border-dim)]"
            }`}
          >
            <input
              type="radio"
              name="provider"
              value={p.provider}
              checked={selected === p.provider}
              onChange={() => setSelected(p.provider)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium text-white">{p.label}</span>
              <span className="block text-xs text-white/50">{p.description}</span>
            </span>
          </label>
        ))}
        {availableProviders.length === 0 && (
          <p className="rounded-[var(--r-sm)] border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            Online payment isn't connected yet — please contact us to complete your signup.
          </p>
        )}
      </div>

      {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={!selected}
        className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue to Payment
      </button>
    </form>
  );
}
