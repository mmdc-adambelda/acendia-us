import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { STATE_CONTENT } from "@/lib/locationContent";

export function generateStaticParams() {
  return Object.keys(STATE_CONTENT).map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const content = STATE_CONTENT[state];
  if (!content) return {};
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/locations/${content.slug}/`,
  });
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const content = STATE_CONTENT[state];
  if (!content) notFound();

  const path = `/locations/${content.slug}/`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: content.metaTitle, description: content.metaDescription, path }),
          faqSchema(content.faqs),
        ]}
      />
      <PageHero
        eyebrow="Location"
        title={`SEO & Digital Marketing in ${content.name}`}
        description={content.heroDescription}
        breadcrumbs={[
          { name: "Locations", path: "/locations/" },
          { name: content.name, path },
        ]}
        image={content.heroImage}
        placeholderIcon="map-pin"
      />

      <Section>
        <Eyebrow>Market context</Eyebrow>
        <h2 className="text-2xl font-semibold text-white">
          What makes {content.name} different
        </h2>
        <p className="mt-4 max-w-3xl whitespace-pre-line text-white/60">{content.marketContext}</p>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Industries we focus on in {content.name}</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">Priority industries</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.industries.map((industry) => (
            <Card key={industry}>
              <p className="text-sm text-white/65">{industry}</p>
            </Card>
          ))}
        </div>
      </Section>

      {content.cities.length > 0 && (
        <Section className="border-t border-[var(--border-dim)]">
          <Eyebrow>Cities</Eyebrow>
          <h2 className="mb-8 text-2xl font-semibold text-white">
            Major {content.name} markets
          </h2>
          <div className="flex flex-wrap gap-3">
            {content.cities.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[var(--border-hi)] hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h2 className="mb-10 text-2xl font-semibold text-white">
          Questions about working with Acendia in {content.name}
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion items={content.faqs} />
        </div>
      </Section>

      <CTASection
        title={`Ready to grow your visibility in ${content.name}?`}
        description="Get a free SEO audit and see exactly where your local opportunities are."
      />
    </>
  );
}
