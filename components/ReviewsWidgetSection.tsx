import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google + Facebook reviews via Trustindex, embedded as plain
 * iframes pointed at Trustindex's own widget pages.
 *
 * Trustindex's dashboard offers this as an <amp-iframe> snippet, but
 * amp-iframe is an AMP component — it only renders on actual AMP pages
 * that load Google's AMP runtime, which this site doesn't (and
 * shouldn't). The src it points to (cdn.trustindex.io/amp-widget.html)
 * is just a normal HTML page though, so a plain <iframe> with the same
 * src works identically outside of AMP, with none of the DOM-position
 * quirks the script-tag "floating/sticky button" widget had (see git
 * history on this file) — an iframe always renders exactly where it's
 * placed, full stop.
 *
 * Renders nothing at all if neither is configured; renders whichever
 * platform(s) actually have an iframe src set, independent of the
 * other — same graceful-degradation pattern as every other optional
 * third-party integration in this app.
 */
export default function ReviewsWidgetSection() {
  const googleIframeSrc = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_IFRAME_SRC;
  const facebookIframeSrc = process.env.NEXT_PUBLIC_FB_REVIEWS_WIDGET_IFRAME_SRC;
  if (!googleIframeSrc && !facebookIframeSrc) return null;

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mb-12 max-w-2xl">
        <Eyebrow>What clients say</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Real reviews from real clients
        </h2>
      </div>
      <div className="space-y-8">
        {googleIframeSrc && (
          <iframe
            src={googleIframeSrc}
            sandbox="allow-scripts allow-same-origin"
            width="100%"
            height={382}
            loading="lazy"
            title="Google reviews"
            className="w-full border-0"
          />
        )}
        {facebookIframeSrc && (
          <iframe
            src={facebookIframeSrc}
            sandbox="allow-scripts allow-same-origin"
            width="100%"
            height={382}
            loading="lazy"
            title="Facebook reviews"
            className="w-full border-0"
          />
        )}
      </div>
    </Section>
  );
}
