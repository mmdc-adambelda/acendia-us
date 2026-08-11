import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { ServiceIcon } from "@/components/icons";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Verified client results from Acendia's SEO, local search, and website work for US businesses — published as engagements complete.",
  path: "/case-studies/",
});

// Cover art for pending case studies. Industries without a generated photo
// cover yet fall back to a code-generated icon placeholder (fallbackIcon)
// so every card still looks intentional rather than empty.
const COVER_IMAGES: Record<string, { src: string; alt: string }> = {
  healthcare: {
    src: "/images/healthcare-case-study-cover.webp",
    alt: "Abstract medical cross and heartbeat pulse cover art",
  },
};

const FALLBACK_ICONS: Record<string, string> = {
  "home-services": "layout",
  legal: "badge-check",
  "real-estate": "map-pin",
  "moving-and-logistics": "layers",
  automotive: "cpu",
  "professional-services": "target",
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
                {cover ? (
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    className="absolute inset-0 object-cover opacity-70"
                  />
                ) : (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <ServiceIcon name={FALLBACK_ICONS[industry.slug] ?? "sparkles"} className="h-14 w-14 text-white/10" />
                  </div>
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
