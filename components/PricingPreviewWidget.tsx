// Single-offer promo card for the homepage hero. Server component — no
// interactivity left here (the old plan-toggle was removed per the CRO
// brief: one offer, one decision), so this ships zero extra client JS.
//
// Real pricing only — mirrors the `growth-package` plan row, so this card
// can never drift out of sync with what the "Join Now" checkout actually
// charges. Single all-in monthly price, no separate setup fee — see the
// "Join Now" homepage flow rewrite (app/api/get-started/checkout/route.ts)
// for why: the Stripe subscription starts billing immediately at
// checkout, not delayed like the older /register flow.

import { Yeseva_One } from "next/font/google";

const yesevaOne = Yeseva_One({ weight: "400", subsets: ["latin"], display: "swap" });

const CORE_FEATURES = [
  "SEO, NEW OPTIMIZED website, and Google Business Profile setup",
  "Ongoing strategy and execution",
  "Monthly progress reporting",
];

const CORE_MONTHLY_CENTS = 99900;

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
        <div className="flex items-center gap-2 border-b border-[var(--border-dim)] px-5 py-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
            A
          </span>
          <span className="text-sm font-semibold text-white">Get Started</span>
        </div>

        <div className="p-5">
          {/* The offer — the visual focal point of the whole hero. Split
              across two elements on purpose: the outer plays a one-shot
              entrance, the inner runs the infinite pulse/glow, so the two
              `transform` animations never contend for the same element —
              see the comment above these keyframes in app/globals.css. */}
          <div className="hero-offer-in">
            <div
              className="hero-offer-live relative overflow-hidden rounded-[var(--r-md)] px-5 py-8 text-center"
              style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 55%, var(--accent-3) 100%)" }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_0%,rgba(255,255,255,0.35),transparent_55%)]"
              />
              <span aria-hidden="true" className="hero-offer-shine" />
              <p className={`${yesevaOne.className} relative text-6xl text-white sm:text-7xl`}>
                {formatMoney(CORE_MONTHLY_CENTS)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-[var(--border-dim)] pt-4">
            {CORE_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm font-bold text-white">
                <span aria-hidden="true" className="mt-0.5 text-white">
                  ✓
                </span>
                {f}
              </div>
            ))}
          </div>

          {/* Real HTML form POST straight to Stripe checkout — no account
              needed first. Deliberately not a <Link> to /register/: the
              new flow is pay now, tell us who you are after (see
              app/api/get-started/checkout/route.ts). */}
          <form method="POST" action="/api/get-started/checkout">
            <button
              type="submit"
              data-event="hero_pricing_widget_cta_clicked"
              className="focus-ring mt-5 flex w-full items-center justify-center gap-1.5 rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold tracking-wide text-black uppercase transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[var(--glow-white)] active:scale-[0.99]"
            >
              Join Now!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
