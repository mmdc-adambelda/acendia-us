import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Section, { Eyebrow } from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { CAMPAIGN_CONTENT } from "@/lib/campaignContent";

export function generateStaticParams() {
  return Object.keys(CAMPAIGN_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = CAMPAIGN_CONTENT[slug];
  if (!content) return {};
  // Campaign pages are intentionally noindex — they're built to match
  // specific outbound email/ad copy, not to rank organically, and keeping
  // them out of the index avoids thin/near-duplicate content issues.
  return buildMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/campaigns/${content.slug}/`,
    noIndex: true,
  });
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = CAMPAIGN_CONTENT[slug];
  if (!content) notFound();

  return (
    <div className="bg-grid">
      <Section className="py-16 sm:py-24">
        <Container className="max-w-4xl">
          <Eyebrow>For {content.audience}</Eyebrow>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {content.headline}
          </h1>
          <p className="text-balance mt-5 max-w-2xl text-lg text-white/60">{content.subheadline}</p>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-base font-semibold text-white">What you'll get</h2>
                <ul className="mt-4 space-y-3">
                  {content.offerPoints.map((point) => (
                    <li key={point} className="text-sm text-white/60">— {point}</li>
                  ))}
                </ul>
              </Card>
              <div className="mt-8 space-y-4">
                {content.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                    <p className="mt-1 text-sm text-white/55">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <LeadForm source="free-seo-audit" submitLabel="Get My Free Audit" />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
