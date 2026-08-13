// Single-offer promo card for the homepage hero. Server component — no
// interactivity left here (the old plan-toggle was removed per the CRO
// brief: one offer, one decision), so this ships zero extra client JS.
//
// Real pricing only — mirrors supabase/migrations/0003_seed_plans.sql
// exactly, so this card can never drift out of sync with what /pricing
// and /register actually charge.
//
// Real billing schedule (see lib/billing.ts): only the setup fee is due
// today. The monthly plan doesn't start billing until 14 days after the
// client's site goes live — never bundled into the same charge.

import Link from "next/link";
import { POST_GOLIVE_BILLING_DELAY_DAYS } from "@/lib/billing";

const CORE_FEATURES = [
  "One-time setup and onboarding",
  "Ongoing SEO strategy and execution",
  "Local search and Google Business Profile optimization",
  "Monthly progress reporting",
];

const SETUP_FEE_CENTS = 19900;
const CORE_MONTHLY_CENTS = 49900;

function formatMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export default function PricingPreviewWidget() {
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
            <span className="text-sm font-semibold text-white">SEO Package</span>
          </div>
          <span className="rounded-full border border-[var(--border-hi)] px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/50 uppercase">
            Most clients start here
          </span>
        </div>

        <div className="p-5">
          {/* The offer — the visual focal point of the whole hero. Split
              across two elements on purpose: the outer plays a one-shot
              entrance, the inner runs the infinite pulse/glow, so the two
              `transform` animations never contend for the same element —
              see the comment above these keyframes in app/globals.css. */}
          <div className="hero-offer-in">
            <div
              className="hero-offer-live relative overflow-hidden rounded-[var(--r-md)] px-5 py-6 text-center"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 55%, var(--accent-3) 100%)" }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(255,255,255,0.35),transparent_55%)]"
              />
              <span aria-hidden="true" className="hero-offer-shine" />
              <p className="relative text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">SEO Package</p>
              <p className="relative mt-2 text-sm font-medium text-white/90">SEO for</p>
              <p className="relative mt-1 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {formatMoney(CORE_MONTHLY_CENTS)}
              </p>
              <p className="relative mt-1 text-sm font-medium text-white/80">/month</p>
            </div>
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
            <div className="flex justify-between font-semibold text-white">
              <span>Due today (setup only)</span>
              <span>{formatMoney(SETUP_FEE_CENTS)}</span>
            </div>
            <p className="text-[11px] text-white/60">
              Then {formatMoney(CORE_MONTHLY_CENTS)}/month, starting {POST_GOLIVE_BILLING_DELAY_DAYS} days after your
              site goes live — not before.
            </p>
          </div>

          <Link
            href="/register/"
            data-event="hero_pricing_widget_cta_clicked"
            className="focus-ring mt-5 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold tracking-wide text-black uppercase transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--glow-white)] active:scale-[0.99]"
          >
            Join Now!
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
