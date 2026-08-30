import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import EbookMockup from "@/components/leadMagnets/EbookMockup";
import LeadMagnetForm from "@/components/leadMagnets/LeadMagnetForm";
import { getLeadMagnet } from "@/lib/leadMagnets";
import { buildMetadata } from "@/lib/seo";
import { webPageSchema } from "@/lib/schema";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const magnet = getLeadMagnet("free-seo-ebook")!;
const path = magnet.path;

export const metadata: Metadata = buildMetadata({
  title: magnet.metaTitle,
  description: magnet.metaDescription,
  path,
});

// No dedicated DigitalDocument schema builder exists in lib/schema.ts yet
// (only Article-shaped ad-hoc objects, defined inline per page — see
// app/insights/*/page.tsx for the same pattern) — built the same way here
// rather than adding a one-off shared function for a single use site-wide.
function ebookSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: magnet.hero.title,
    description: magnet.metaDescription,
    url: `${SITE_URL}${path}`,
    publisher: { "@type": "Organization", name: SITE_NAME },
    isAccessibleForFree: false,
  };
}

export default async function FreeSeoEbookPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  // The subscribe route (app/api/lead-magnets/[slug]/subscribe/route.ts)
  // already redirects back with a complete, human-readable message —
  // shown as-is rather than mapped through error codes.
  const errorMessage = error || undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: magnet.metaTitle, description: magnet.metaDescription, path }),
          ebookSchema(),
        ]}
      />

      <PageHero
        eyebrow={magnet.hero.eyebrow}
        title={magnet.hero.title}
        description={magnet.hero.supporting}
        breadcrumbs={[{ name: "Free SEO Ebook", path }]}
      >
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href="#lead-form"
            data-event="ebook_cta_click"
            className="focus-ring inline-flex items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            {magnet.hero.ctaLabel}
          </a>
          <p className="text-sm text-white/50">{magnet.hero.trustStatement}</p>
        </div>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Eyebrow>What you&apos;ll learn</Eyebrow>
            <h2 className="text-2xl font-semibold text-white">A practical on-page SEO foundation</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {magnet.valuePoints.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-white/65">
                  <span aria-hidden="true" className="mt-0.5 text-white/40">
                    —
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Eyebrow>Who should download it</Eyebrow>
              <h2 className="text-2xl font-semibold text-white">Built for business owners, not SEO specialists</h2>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {magnet.whoShouldDownload.map((audience) => (
                  <span
                    key={audience}
                    className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs text-white/60"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-[260px] lg:col-span-2 lg:block">
            <EbookMockup title={magnet.hero.title} className="sticky top-24" />
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]" id="lead-form">
        <div className="mx-auto max-w-xl">
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-white">Get your free copy</h2>
            <p className="mt-2 text-sm text-white/55">
              Fill out the form below and we&apos;ll unlock your download immediately.
            </p>
            <div className="mt-6">
              <LeadMagnetForm magnet={magnet} errorMessage={errorMessage} />
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
