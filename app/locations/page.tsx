import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { PRIORITY_CITIES, PRIORITY_STATES } from "@/lib/site";
import { STATE_CONTENT, CITY_CONTENT } from "@/lib/locationContent";

export const metadata: Metadata = buildMetadata({
  title: "US Locations We Serve",
  description:
    "Acendia provides SEO and digital marketing services to businesses across the United States, with priority coverage in Texas, Florida, California, New York, Georgia, North Carolina, Arizona, and Illinois.",
  path: "/locations/",
});

const stateSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export default function LocationsHubPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "US Locations",
          description: "Acendia provides SEO and digital marketing services to businesses across the United States.",
          path: "/locations/",
        })}
      />
      <PageHero
        eyebrow="Locations"
        title="Serving businesses across the United States"
        description="We work remotely with businesses nationwide. Our deepest local market research is currently concentrated in these priority states — with more markets being added over time."
        breadcrumbs={[{ name: "Locations", path: "/locations/" }]}
      />

      <Section>
        <Eyebrow>Priority states</Eyebrow>
        <h2 className="mb-8 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Where we're building the deepest local coverage first
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRIORITY_STATES.map((state) => {
            const slug = stateSlug(state);
            const hasPage = Boolean(STATE_CONTENT[slug]);
            return hasPage ? (
              <Card key={state} href={`/locations/${slug}/`} dataEvent="location_cta_clicked">
                <h3 className="text-base font-semibold text-white">{state}</h3>
                <span className="mt-3 inline-block text-sm text-white/50">View state page →</span>
              </Card>
            ) : (
              <Card key={state} className="opacity-60">
                <h3 className="text-base font-semibold text-white/80">{state}</h3>
                <span className="mt-3 inline-block text-xs uppercase tracking-wide text-white/35">
                  Coming soon
                </span>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Priority cities</Eyebrow>
        <h2 className="mb-8 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Metro markets we're prioritizing
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRIORITY_CITIES.map((c) => {
            const key = `${c.stateSlug}/${c.slug}`;
            const hasPage = Boolean(CITY_CONTENT[key]);
            return hasPage ? (
              <Card key={c.slug} href={`/locations/${c.stateSlug}/${c.slug}/`} dataEvent="location_cta_clicked">
                <h3 className="text-base font-semibold text-white">{c.city}</h3>
                <p className="mt-1 text-sm text-white/45">{c.state}</p>
                <span className="mt-3 inline-block text-sm text-white/50">View city page →</span>
              </Card>
            ) : (
              <Card key={c.slug} className="opacity-60">
                <h3 className="text-base font-semibold text-white/80">{c.city}</h3>
                <p className="mt-1 text-sm text-white/35">{c.state}</p>
                <span className="mt-3 inline-block text-xs uppercase tracking-wide text-white/35">
                  Coming soon
                </span>
              </Card>
            );
          })}
        </div>
      </Section>

      <CTASection
        title="Don't see your market yet?"
        description="We work with businesses across the entire United States — reach out and we'll talk through your specific location."
      />
    </>
  );
}
