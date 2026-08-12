"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentProvider } from "@/lib/payments/types";

type Props = {
  availableProviders: { provider: PaymentProvider; label: string; description: string }[];
  planSummary: { name: string; setupFeeCents: number; monthlyPriceCents: number }[];
};

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function CheckoutClient({ availableProviders, planSummary }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentProvider | null>(availableProviders[0]?.provider ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wiseResult, setWiseResult] = useState<{ reference: string; paymentLink: string | null; amountCents: number } | null>(
    null,
  );

  const totalSetup = planSummary.reduce((s, p) => s + p.setupFeeCents, 0);
  const totalMonthly = planSummary.reduce((s, p) => s + p.monthlyPriceCents, 0);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      if (data.provider === "wise") {
        setWiseResult({ reference: data.reference, paymentLink: data.paymentLink, amountCents: data.amountCents });
        setLoading(false);
        return;
      }
      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (wiseResult) {
    return (
      <div className="rounded-[var(--r-md)] border border-[var(--border-dim)] bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white">Complete your setup payment via Wise</h2>
        <p className="mt-2 text-sm text-white/60">
          This is your one-time setup fee only — confirmed manually by our team once the transfer arrives, usually
          within one business day. Your monthly plan is a separate Wise invoice we&apos;ll send 14 days after your
          site goes live; nothing else is due today.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between border-b border-[var(--border-dim)] pb-2">
            <dt className="text-white/50">Setup fee due today</dt>
            <dd className="font-medium text-white">{formatCents(wiseResult.amountCents)}</dd>
          </div>
          <div className="flex justify-between border-b border-[var(--border-dim)] pb-2">
            <dt className="text-white/50">Payment reference (required)</dt>
            <dd className="font-mono font-medium text-white">{wiseResult.reference}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-white/60">
          Include the reference above in your Wise transfer notes so we can match your payment.
        </p>
        {wiseResult.paymentLink ? (
          <a
            href={wiseResult.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-6 inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Open Wise Payment Link
          </a>
        ) : (
          <p className="mt-4 rounded-[var(--r-sm)] border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            Our team will reach out with Wise transfer details shortly. Reference the code above in your transfer.
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push("/checkout/success/")}
          className="focus-ring mt-4 block text-sm text-white/50 underline hover:text-white"
        >
          I've sent the transfer — continue
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--r-md)] border border-[var(--border-dim)] bg-white/[0.03] p-6">
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

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        type="button"
        disabled={!selected || loading}
        onClick={handleContinue}
        className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting checkout…" : "Continue to Payment"}
      </button>
    </div>
  );
}
