// Homepage-only announcement strip above the header. Real, enforced offer
// per the owner (confirmed explicitly, not fabricated urgency): $199 is
// the real one-time setup fee due today, and this specific offer ends
// September 30 — after that the rate and/or terms change.
export default function PromoStripBanner() {
  return (
    <div
      className="w-full py-2 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs"
      style={{ background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)" }}
    >
      <p className="mx-auto max-w-7xl px-4">GET STARTED FOR $199 · OFFER ENDS SEPTEMBER 30</p>
    </div>
  );
}
