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
import { CITY_CONTENT } from "@/lib/locationContent";

export function generateStaticParams() {
  return Object.keys(CITY_CONTENT).map((key) => {
    const [state, city] = key.split("/");
    return { state, city };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const content = CITY_CONTENT[`${state}/${city}`];
  if (!content) return {};
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/locations/${content.stateSlug}/${content.slug}/`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const content = CITY_CONTENT[`${state}/${city}`];
  if (!content) notFound();

  const path = `/locations/${content.stateSlug}/${content.slug}/`;

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
        title={`SEO Agency in ${content.city}, ${content.stateName}`}
        description={content.heroDescription}
        breadcrumbs={[
          { name: "Locations", path: "/locations/" },
          { name: content.stateName, path: `/locations/${content.stateSlug}/` },
          { name: content.city, path },
        ]}
        image={content.heroImage}
        placeholderIcon="map-pin"
      />

      <Section>
        <Eyebrow>Market context</Eyebrow>
        <h2 className="text-2xl font-semibold text-white">
          What makes {content.city} different
        </h2>
        <p className="mt-4 max-w-3xl text-white/60">{content.marketContext}</p>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Industries</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">
          Industries we focus on in {content.city}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.industries.map((industry) => (
            <Card key={industry}>
              <p className="text-sm text-white/65">{industry}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Common challenges</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">
          Digital visibility challenges in {content.city}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {content.challenges.map((c) => (
            <Card key={c.title}>
              <h3 className="text-base font-semibold text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-white/55">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Local SEO opportunities</Eyebrow>
            <h2 className="text-2xl font-semibold text-white">Where the upside is</h2>
            <ul className="mt-6 space-y-3">
              {content.opportunities.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Recommended services</Eyebrow>
            <h2 className="text-2xl font-semibold text-white">Where we'd start</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.recommendedServices.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[var(--border-hi)] hover:text-white"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <Eyebrow>
              <span className="mt-8 block">Nearby markets</span>
            </Eyebrow>
            <div className="mt-3 flex flex-wrap gap-3">
              {content.nearbyMarkets.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="focus-ring rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {m.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h2 className="mb-10 text-2xl font-semibold text-white">
          Questions about working with Acendia in {content.city}
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion items={content.faqs} />
        </div>
      </Section>

      <CTASection
        title={`Ready to grow your visibility in ${content.city}?`}
        description="Get a free SEO audit and see exactly where your local opportunities are."
      />
    </>
  );
}
