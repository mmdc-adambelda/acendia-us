import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Verified client results from Acendia's SEO, local search, and website work for US businesses — published as engagements complete.",
  path: "/case-studies/",
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Case Studies",
          description: "Verified client results from Acendia's SEO and digital marketing work for US businesses.",
          path: "/case-studies/",
        })}
      />
      <PageHero
        eyebrow="Case studies"
        title="Real results, published only once they're verified"
        description="We'd rather this page be sparse than misleading. As engagements complete and clients approve sharing their results, verified case studies will be published here with real numbers and context."
        breadcrumbs={[{ name: "Case Studies", path: "/case-studies/" }]}
      />
      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry) => (
            <Card key={industry.slug} className="flex h-44 flex-col items-center justify-center text-center">
              <span className="text-sm font-medium text-white/40">{industry.name}</span>
              <span className="mt-2 text-xs uppercase tracking-wide text-white/25">
                Case study coming soon
              </span>
            </Card>
          ))}
        </div>
      </Section>
      <CTASection
        title="Want to be one of our first published results?"
        description="Start with a free SEO audit — we'll show you exactly what we'd track and report on."
      />
    </>
  );
}
