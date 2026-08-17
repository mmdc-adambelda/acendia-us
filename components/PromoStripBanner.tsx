// Homepage-only announcement strip above the header. Real, enforced offer
// per the owner (confirmed explicitly, not fabricated urgency): the
// $499/mo SEO Package rate is limited to the first 100 clients and this
// specific offer ends September 30 — after that the rate and/or terms
// change. $2,500/mo is the owner-confirmed real, normal value of
// comparable ongoing SEO service, not a fabricated "was" price.
export default function PromoStripBanner() {
  return (
    <div
      className="w-full py-2 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs"
      style={{ background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)" }}
    >
      <p className="mx-auto max-w-7xl px-4">
        FIRST 100 CLIENTS ONLY · SEO PACKAGE AT $499/MO (VALUED AT $2,500/MO) · OFFER ENDS SEPTEMBER 30
      </p>
    </div>
  );
}
