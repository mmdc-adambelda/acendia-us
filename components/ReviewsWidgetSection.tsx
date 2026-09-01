import Script from "next/script";
import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google reviews via Trustindex — chosen over the official Google
 * Places API since that requires a Google Cloud project with billing
 * enabled. Trustindex's loader script is fully self-contained (the
 * widget key lives in its own query string, and it injects its own
 * markup — no separate container div needed), unlike some other
 * providers, so this is deliberately just the one <Script> tag.
 *
 * Renders nothing at all if unconfigured — same graceful-degradation
 * pattern as every other optional third-party integration in this app.
 */
export default function ReviewsWidgetSection() {
  const scriptSrc = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_SCRIPT_SRC;
  if (!scriptSrc) return null;

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mb-12 max-w-2xl">
        <Eyebrow>What clients say</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Real reviews from real clients
        </h2>
      </div>
      <Script src={scriptSrc} strategy="lazyOnload" />
    </Section>
  );
}
