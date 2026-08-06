import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import IndustryGrid from "@/components/IndustryGrid";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Acendia builds SEO and digital marketing strategy for industries where local search visibility has real, measurable lead value — home services, legal, healthcare, real estate, and more.",
  path: "/industries/",
});

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Industries",
          description: "Industries where local search visibility has real, measurable lead value.",
          path: "/industries/",
        })}
      />
      <PageHero
        eyebrow="Industries"
        title="Built for industries where one lead has real value"
        description="We focus deliberately on categories where local search visibility translates directly into booked jobs, signed contracts, or new patients — not every business benefits equally from SEO investment."
        breadcrumbs={[{ name: "Industries", path: "/industries/" }]}
      />
      <Section>
        <IndustryGrid />
      </Section>
      <CTASection
        title="Don't see your industry listed yet?"
        description="We're expanding industry coverage regularly — tell us about your business and we'll assess the opportunity."
      />
    </>
  );
}
