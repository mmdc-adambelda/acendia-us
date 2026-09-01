/**
 * Trustindex's certification/trust badge — a distinct loader
 * (loader-cert.js, not loader.js) from the review widgets in
 * components/ReviewsWidgetSection.tsx. Rendered as a plain native
 * <script> tag (matching Trustindex's actual embed snippet exactly),
 * not next/script's <Script> component — Trustindex's loader uses
 * document.currentScript to find its own DOM position and injects its
 * badge markup right there, but <Script>'s managed strategies don't
 * preserve JSX position (they inject the real tag at the end of
 * <body>), which is why this needs to be a real inline <script> to
 * actually land inside the footer where it's rendered.
 *
 * Renders nothing at all if unconfigured — same graceful-degradation
 * pattern as every other optional third-party integration in this app.
 */
export default function TrustBadge() {
  const scriptSrc = process.env.NEXT_PUBLIC_TRUSTINDEX_CERT_BADGE_SCRIPT_SRC;
  if (!scriptSrc) return null;

  return <script defer async src={scriptSrc} />;
}
