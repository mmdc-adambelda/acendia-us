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
import { INDUSTRY_CONTENT } from "@/lib/industryContent";

export function generateStaticParams() {
  return Object.keys(INDUSTRY_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = INDUSTRY_CONTENT[slug];
  if (!content) return {};
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/industries/${content.slug}/`,
  });
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = INDUSTRY_CONTENT[slug];
  if (!content) notFound();

  const path = `/industries/${content.slug}/`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: content.metaTitle, description: content.metaDescription, path }),
          faqSchema(content.faqs),
        ]}
      />
      <PageHero
        eyebrow="Industry"
        title={content.name}
        description={content.heroDescription}
        breadcrumbs={[
          { name: "Industries", path: "/industries/" },
          { name: content.name, path },
        ]}
        image={content.heroImage}
      />

      <Section>
        <Eyebrow>Industry challenges</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">
          What makes {content.name.toLowerCase()} marketing different
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
        <Eyebrow>How customers search</Eyebrow>
        <h2 className="text-2xl font-semibold text-white">Search behavior in this category</h2>
        <p className="mt-4 max-w-3xl text-white/60">{content.howCustomersSearch}</p>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div>
            <Eyebrow>SEO opportunities</Eyebrow>
            <ul className="mt-4 space-y-3">
              {content.seoOpportunities.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Google Business Profile opportunities</Eyebrow>
            <ul className="mt-4 space-y-3">
              {content.gbpOpportunities.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Conversion opportunities</Eyebrow>
            <ul className="mt-4 space-y-3">
              {content.conversionOpportunities.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Recommended content strategy</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">Content that works for this industry</h2>
        <ul className="space-y-3">
          {content.contentStrategy.map((item) => (
            <li key={item} className="text-sm text-white/60">— {item}</li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <div>
            <Eyebrow>Priority states</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.states.map((s) => (
                <span key={s} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Recommended services</Eyebrow>
            <div className="mt-4 flex flex-wrap gap-3">
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
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h2 className="mb-10 text-2xl font-semibold text-white">
          Common questions from {content.name.toLowerCase()} businesses
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion items={content.faqs} />
        </div>
      </Section>

      <CTASection
        title={`Ready to grow your ${content.name.toLowerCase()} business?`}
        description="Get a free SEO audit built around your specific industry and market."
      />
    </>
  );
}
