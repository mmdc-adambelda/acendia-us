import Script from "next/script";
import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google + Facebook reviews via Trustindex — chosen over the
 * official Google Places API since that requires a Google Cloud project
 * with billing enabled. Each Trustindex loader script is fully self-
 * contained (the widget key lives in its own query string, and it
 * injects its own markup via document.currentScript — no separate
 * container div needed), so this is deliberately just one <Script> tag
 * per platform, matching each platform's real embed snippet exactly.
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
