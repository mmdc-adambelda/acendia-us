"use client";

// Interactive plan-preview card for the homepage hero — inspired by the
// "live checkout" pattern (pick a plan, see the total update, one CTA to
// convert) but built entirely from the site's existing black/white/gray
// token system (--card, --border, --border-hi, --r-*, --glow-white) with
// zero new brand colors introduced. Real pricing only — mirrors
// supabase/migrations/0003_seed_plans.sql exactly, so this card can never
// drift out of sync with what /pricing and /register actually charge.

import { useState } from "react";
import Link from "next/link";

const CORE_FEATURES = [
  "One-time setup and onboarding",
  "Ongoing SEO strategy and execution",
  "Local search and Google Business Profile optimization",
  "Monthly progress reporting",
];

const SETUP_FEE_CENTS = 19900;
const CORE_MONTHLY_CENTS = 49900;
const ADDON_MONTHLY_CENTS = 29900;

function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export default function PricingPreviewWidget() {
  const [addonSelected, setAddonSelected] = useState(false);
  const monthlyTotal = CORE_MONTHLY_CENTS + (addonSelected ? ADDON_MONTHLY_CENTS : 0);

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Ambient glow behind the card, matching the hero's existing radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[var(--r-xl)] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.10),transparent_70%)]"
      />

      <div className="relative overflow-hidden rounded-[var(--r-lg)] border border-[var(--border-hi)] bg-[var(--card)] shadow-[var(--shadow-dark)]">
        {/* Header row — mimics a product/app chrome bar for visual familiarity */}
        <div className="flex items-center justify-between border-b border-[var(--border-dim)] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
              A
            </span>
            <span className="text-sm font-semibold text-white">Acendia Growth Package</span>
          </div>
          <span className="rounded-full border border-[var(--border-hi)] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/50 uppercase">
            Most clients start here
          </span>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium tracking-wide text-white/40 uppercase">Choose your plan</p>

          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => setAddonSelected(false)}
              aria-pressed={!addonSelected}
              className={`focus-ring flex w-full items-center justify-between rounded-[var(--r-sm)] border px-4 py-3 text-left text-sm transition-colors ${
                !addonSelected
                  ? "border-white bg-white/[0.06] text-white"
                  : "border-[var(--border)] text-white/60 hover:border-[var(--border-hi)]"
              }`}
            >
              <span>SEO Growth Package</span>
              <span className="font-medium">{formatMoney(CORE_MONTHLY_CENTS)}/mo</span>
            </button>
            <button
              type="button"
              onClick={() => setAddonSelected(true)}
              aria-pressed={addonSelected}
              className={`focus-ring flex w-full items-center justify-between rounded-[var(--r-sm)] border px-4 py-3 text-left text-sm transition-colors ${
                addonSelected
                  ? "border-white bg-white/[0.06] text-white"
                  : "border-[var(--border)] text-white/60 hover:border-[var(--border-hi)]"
              }`}
            >
              <span>+ Social Media Management</span>
              <span className="font-medium">+{formatMoney(ADDON_MONTHLY_CENTS)}/mo</span>
            </button>
          </div>

          <div className="mt-5 space-y-2 border-t border-[var(--border-dim)] pt-4">
            {CORE_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2 text-xs text-white/55">
                <span aria-hidden="true" className="mt-0.5 text-white/70">
                  ✓
                </span>
                {f}
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-1.5 border-t border-[var(--border-dim)] pt-4 text-sm">
            <div className="flex justify-between text-white/50">
              <span>One-time setup</span>
              <span>{formatMoney(SETUP_FEE_CENTS)}</span>
            </div>
            <div className="flex justify-between font-semibold text-white">
              <span>Total due today</span>
              <span>{formatMoney(SETUP_FEE_CENTS + monthlyTotal)}</span>
            </div>
            <p className="text-[11px] text-white/35">then {formatMoney(monthlyTotal)}/month</p>
          </div>

          <Link
            href="/register/"
            data-event="hero_pricing_widget_cta_clicked"
            className="focus-ring mt-5 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] hover:-translate-y-0.5"
          >
            Start Growing
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/pricing/"
            className="focus-ring mt-3 block text-center text-xs text-white/40 hover:text-white"
          >
            See full pricing details
          </Link>
        </div>
      </div>
    </div>
  );
}
