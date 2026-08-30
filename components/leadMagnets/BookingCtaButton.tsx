"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * Clicking through to book fires two distinct events — the CTA click
 * itself and the booking-link click — which the plain static `data-event`
 * attribute convention used elsewhere in this app can't express (it only
 * holds one string). This one button genuinely needs both, so it's a
 * small client component rather than a static anchor.
 */
export default function BookingCtaButton({ href, label }: { href: string; label: string }) {
  function handleClick() {
    trackEvent("seo_audit_cta_click");
    trackEvent("booking_click");
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="focus-ring inline-flex items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
    >
      {label}
    </a>
  );
}
