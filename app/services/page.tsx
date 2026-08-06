import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SEO & Digital Marketing Services for US Businesses",
  description:
    "Explore Acendia's full range of SEO, local search, website, and digital marketing services built for US businesses — from technical SEO to AI-powered marketing.",
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Services",
          description: "Acendia's full range of SEO, local search, website, and digital marketing services for US businesses.",
          path: "/services/",
        })}
      />
      <PageHero
        eyebrow="Services"
        title="Every service you need to turn search into revenue"
        description="Each service below works as a standalone engagement or as part of a connected growth system — SEO earns visibility, your website converts it, and reporting keeps the whole thing accountable."
        breadcrumbs={[{ name: "Services", path: "/services/" }]}
      />
      <Section>
        <ServiceGrid />
      </Section>
      <CTASection
        title="Not sure which service fits your business?"
        description="Get a free SEO audit and we'll recommend a starting point based on what we actually find."
      />
    </>
  );
}
