import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SERVICE_CONTENT, SERVICE_SLUGS } from "@/lib/serviceContent";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = SERVICE_CONTENT[slug];
  if (!content) return {};
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/services/${content.slug}/`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = SERVICE_CONTENT[slug];
  if (!content) notFound();

  const path = `/services/${content.slug}/`;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: content.metaTitle, description: content.metaDescription, path }),
          serviceSchema({
            name: content.name,
            description: content.metaDescription,
            path,
            serviceType: content.name,
          }),
          faqSchema(content.faqs),
        ]}
      />
      <PageHero
        eyebrow="Service"
        title={content.h1 ?? content.name}
        description={content.heroDescription}
        breadcrumbs={[
          { name: "Services", path: "/services/" },
          { name: content.name, path },
        ]}
      />

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Card>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-xl font-semibold text-white">{content.problem.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{content.problem.body}</p>
          </Card>
          <Card>
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="text-xl font-semibold text-white">{content.solution.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{content.solution.body}</p>
          </Card>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>What's included</Eyebrow>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Everything covered in this engagement
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {content.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/65">
              <span aria-hidden="true" className="mt-1 text-white/40">—</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mb-10 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          The process, step by step
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.howItWorks.map((item) => (
            <div key={item.step}>
              <span className="text-sm font-semibold text-white/30">{item.step}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Expected outcomes</Eyebrow>
            <h2 className="text-2xl font-semibold text-white">What businesses typically gain</h2>
            <ul className="mt-6 space-y-3">
              {content.outcomes.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/35">
              Outcomes vary by market and starting point — we don't promise specific rankings or
              lead volume.
            </p>
          </div>
          <div>
            <Eyebrow>Who this is for</Eyebrow>
            <h2 className="text-2xl font-semibold text-white">Suitable business types</h2>
            <ul className="mt-6 space-y-3">
              {content.suitableFor.map((item) => (
                <li key={item} className="text-sm text-white/60">— {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Where this applies</Eyebrow>
        <h2 className="mb-8 text-2xl font-semibold text-white">Example scenarios we work with</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {content.examples.map((example) => (
            <Card key={example}>
              <p className="text-sm text-white/60">{example}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h2 className="mb-10 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Common questions about {content.name.toLowerCase()}
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion items={content.faqs} />
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Related services</Eyebrow>
        <div className="flex flex-wrap gap-3">
          {content.internalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[var(--border-hi)] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Section>

      <CTASection
        title={`Ready to talk about ${content.name.toLowerCase()} for your business?`}
        description="Get a free SEO audit and a specific recommendation on where to start."
      />
    </>
  );
}
