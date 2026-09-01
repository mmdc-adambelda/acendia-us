import Script from "next/script";
import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google + Facebook reviews via Trustindex — chosen over the
 * official Google Places API since that requires a Google Cloud project
 * with billing enabled.
 *
 * Uses next/script's <Script strategy="lazyOnload">, not a plain
 * <script> tag — confirmed live that a plain tag causes this specific
 * widget to never actually expand/show content (its own visibility-
 * detection logic behaves differently depending on load timing), while
 * <Script> reliably renders it. This widget is currently configured on
 * Trustindex's dashboard as a "floating sticky button" layout
 * (confirmed via its own rendered class names,
 * ti-sticky-button/ti-position-right) — that's what causes it to
 * attach itself to document.body and appear at the end of the page
 * instead of inline here, regardless of where this script tag sits.
 * Fixing the position requires switching that widget's layout/display
 * type in the Trustindex dashboard to an inline type (Grid/Carousel/
 * List) — not something controllable from the embed code.
 *
 * Renders nothing at all if neither is configured; renders whichever
 * platform(s) actually have a script src set, independent of the other —
 * same graceful-degradation pattern as every other optional third-party
 * integration in this app.
 */
export default function ReviewsWidgetSection() {
  const googleScriptSrc = process.env.NEXT_PUBLIC_REVIEWS_WIDGET_SCRIPT_SRC;
  const facebookScriptSrc = process.env.NEXT_PUBLIC_FB_REVIEWS_WIDGET_SCRIPT_SRC;
  if (!googleScriptSrc && !facebookScriptSrc) return null;

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="mb-12 max-w-2xl">
        <Eyebrow>What clients say</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Real reviews from real clients
        </h2>
      </div>
      {googleScriptSrc && <Script src={googleScriptSrc} strategy="lazyOnload" />}
      {facebookScriptSrc && <Script src={facebookScriptSrc} strategy="lazyOnload" />}
    </Section>
  );
}
