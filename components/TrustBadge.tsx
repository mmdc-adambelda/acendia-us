"use client";

import { useEffect } from "react";
import Script from "next/script";

// The badge's own positioning CSS lives in a cross-origin stylesheet
// (cdn.trustindex.io/assets/widget-presetted-css/...) — confirmed via
// direct inspection that its cssRules aren't even readable from our own
// JS due to CORS, so there's no way to know its exact specificity to
// out-rank it with a plain CSS override (tried; a boosted-specificity
// !important rule in our own stylesheet still lost to theirs). Inline
// styles with !important always win over any external stylesheet
// regardless of its specificity, so this repositions the badge that way
// instead, once Trustindex's script has created it.
function moveBadgeLeft() {
  const el = document.querySelector<HTMLElement>(".ti-sticky-button.ti-position-right");
  if (!el) return false;
  el.style.setProperty("left", "15px", "important");
  el.style.setProperty("right", "auto", "important");
  return true;
}

/**
 * Trustindex's certification/trust badge — a distinct loader
 * (loader-cert.js, not loader.js) from the review widgets in
 * components/ReviewsWidgetSection.tsx. Renders nothing at all if
 * unconfigured — same graceful-degradation pattern as every other
 * optional third-party integration in this app.
 *
 * Defaults to the bottom-right corner, which overlaps the live chat
 * bubble (also bottom-right) — the effect above moves it to the
 * bottom-left instead, once Trustindex's script has injected it
 * (timing is unpredictable, so this watches for it via
 * MutationObserver rather than a fixed delay).
 */
export default function TrustBadge() {
  const scriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_CERT_BADGE_SCRIPT_SRC;

  useEffect(() => {
    if (!scriptSrc) return;
    if (moveBadgeLeft()) return;

    const observer = new MutationObserver(() => {
      if (moveBadgeLeft()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [scriptSrc]);

  if (!scriptSrc) return null;

  return <Script src={scriptSrc} strategy="lazyOnload" />;
}
