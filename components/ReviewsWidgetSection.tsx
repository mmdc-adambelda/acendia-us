import Script from "next/script";
import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google reviews via a third-party embed widget (e.g. Trustindex,
 * Elfsight, EmbedSocial) — chosen over the official Google Places API
 * since that requires a Google Cloud project with billing enabled.
 *
 * NOTE: this is a conservative placeholder shape (a loader script + a
 * generic container div carrying the widget ID as both a class and a
 * data attribute, since providers disagree on which one they read).
 * Different providers use meaningfully different embed markup — once a
 * specific service is chosen and its exact embed snippet is in hand,
 * this component should be replaced with that snippet's real structure
 * verbatim, the same way components/ChatWidget.tsx was built directly
 * from GoHighLevel's actual snippet rather than a guess.
 *
 * Renders nothing at all if unconfigured — same graceful-degradation
 * pattern as every other optional third-party integration in this app.
 */
export default function ReviewsWidgetSection() {
  const scriptSrc = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_SCRIPT_SRC;
  const widgetId = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_ID;
  if (!scriptSrc || !widgetId) return null;

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mb-12 max-w-2xl">
        <Eyebrow>What clients say</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Real reviews from real clients
        </h2>
      </div>
      <Script src={scriptSrc} strategy="lazyOnload" />
      <div id={`reviews-widget-${widgetId}`} data-widget-id={widgetId} className={`reviews-widget-${widgetId}`} />
    </Section>
  );
}
