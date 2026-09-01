import Script from "next/script";

/**
 * Trustindex's certification/trust badge — a distinct loader
 * (loader-cert.js, not loader.js) from the review widgets in
 * components/ReviewsWidgetSection.tsx. Uses next/script's <Script>,
 * matching the review widgets' approach — see the long comment there
 * for why a plain <script> tag was tried and reverted.
 *
 * Renders nothing at all if unconfigured — same graceful-degradation
 * pattern as every other optional third-party integration in this app.
 */
export default function TrustBadge() {
  const scriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_CERT_BADGE_SCRIPT_SRC;
  if (!scriptSrc) return null;

  return <Script src={scriptSrc} strategy="lazyOnload" />;
}
