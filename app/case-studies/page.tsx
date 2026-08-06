import type { Metadata } from "next";
import Image from "next/image";
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

// Cover art for pending case studies. Only industries with a generated
// cover appear here — others fall back to the plain text placeholder card.
const COVER_IMAGES: Record<string, { src: string; alt: string }> = {
  healthcare: {
    src: "/images/healthcare-case-study-cover.webp",
    alt: "Abstract medical cross and heartbeat pulse cover art",
  },
};

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
          {INDUSTRIES.map((industry) => {
            const cover = COVER_IMAGES[industry.slug];
            return (
              <Card key={industry.slug} className="relative flex h-44 flex-col items-center justify-center overflow-hidden text-center">
                {cover && (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    className="absolute inset-0 object-cover opacity-70"
                  />
                )}
                <span className="relative z-10 text-sm font-medium text-white/70">{industry.name}</span>
                <span className="relative z-10 mt-2 text-xs uppercase tracking-wide text-white/40">
                  Case study coming soon
                </span>
              </Card>
            );
          })}
        </div>
      </Section>
      <CTASection
        title="Want to be one of our first published results?"
        description="Start with a free SEO audit — we'll show you exactly what we'd track and report on."
      />
    </>
  );
}
