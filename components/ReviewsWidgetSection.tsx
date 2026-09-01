import Section, { Eyebrow } from "@/components/Section";

/**
 * Real Google + Facebook reviews via Trustindex — chosen over the
 * official Google Places API since that requires a Google Cloud project
 * with billing enabled. Each Trustindex loader script uses
 * document.currentScript to find its own position in the DOM and
 * injects its widget markup right there — so this deliberately renders
 * a plain native <script> tag (matching Trustindex's actual embed
 * snippet exactly) rather than next/script's <Script> component.
 * <Script>'s "lazyOnload"/"afterInteractive" strategies don't preserve
 * JSX position — they inject the real script tag at the end of <body>
 * (after Footer), which is why the widgets rendered below the footer
 * instead of here when this used <Script> — confirmed live, this was a
 * real bug, not just a theoretical concern.
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
      {googleScriptSrc && <script defer async src={googleScriptSrc} />}
      {facebookScriptSrc && <script defer async src={facebookScriptSrc} />}
    </Section>
  );
}
