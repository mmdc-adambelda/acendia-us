import Link from "next/link";
import Section, { Eyebrow } from "@/components/Section";
import EbookMockup from "./EbookMockup";
import { LEAD_MAGNETS } from "@/lib/leadMagnets";

const BENEFITS = [
  "Understand search intent and keyword targeting",
  "Optimize titles, headings and page content",
  "Improve internal linking and website structure",
  "Learn local SEO fundamentals",
  "Identify common on-page SEO mistakes",
];

/**
 * Homepage teaser for the free SEO ebook lead magnet (lib/leadMagnets.ts,
 * slug "free-seo-ebook"). Deliberately its own section, not folded into
 * PricingPreviewWidget or CTASection, so it doesn't compete with either
 * of the homepage's primary conversion paths (Join Now / Free SEO
 * Audit) — this is a softer, resource-style offer for visitors not yet
 * ready for either of those.
 */
export default function EbookHomepageSection() {
  const magnet = LEAD_MAGNETS["free-seo-ebook"];

  return (
    <Section className="border-t border-[var(--border-dim)]">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <Eyebrow>Free SEO Guide</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Want to Improve Your Google Rankings?
          </h2>
          <p className="mt-5 text-lg text-white/60">
            Download our free guide to On-Page SEO and learn the essential strategies businesses can use to improve
            search visibility, attract more qualified organic traffic, and build a stronger foundation for
            sustainable growth.
          </p>
          <div className="mt-6 space-y-2">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2 text-sm text-white/70">
                <span aria-hidden="true" className="mt-0.5 text-white/70">
                  ✓
                </span>
                {b}
              </div>
            ))}
          </div>
          <Link
            href={magnet.path}
            data-event="ebook_homepage_cta_click"
            className="focus-ring mt-8 inline-flex items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Get the Free SEO Ebook
          </Link>
        </div>
        <div className="order-1 mx-auto w-full max-w-[280px] lg:order-2 lg:max-w-[320px]">
          <EbookMockup title={magnet.hero.title} />
        </div>
      </div>
    </Section>
  );
}
