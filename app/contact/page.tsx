import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Talk to Acendia about SEO, local search, website design, or digital marketing for your US business. Tell us about your goals and we'll follow up within one business day.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Contact",
          description: "Talk to Acendia about SEO, local search, or digital marketing for your US business.",
          path: "/contact/",
        })}
      />
      <PageHero
        eyebrow="Contact"
        title="Tell us about your business — we'll take it from there"
        description="Whether you're ready to start or just comparing options, share a few details below and a member of our team will follow up within one business day."
        breadcrumbs={[{ name: "Contact", path: "/contact/" }]}
      />
      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-base font-semibold text-white">Prefer to connect elsewhere?</h2>
              <p className="mt-2 text-sm text-white/55">
                Find us on social, or use the form to reach our team directly — we don&apos;t
                publish a general phone line or inbox, so every inquiry gets routed and answered
                by a person.
              </p>
              <div className="mt-5 flex flex-col gap-2 text-sm">
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="focus-ring text-white/70 hover:text-white">
                  LinkedIn
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="focus-ring text-white/70 hover:text-white">
                  Facebook
                </a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="focus-ring text-white/70 hover:text-white">
                  Instagram
                </a>
              </div>
            </Card>
            <Card>
              <h2 className="text-base font-semibold text-white">Serving businesses nationwide</h2>
              <p className="mt-2 text-sm text-white/55">
                We work remotely with clients across the United States, with concentrated market
                research in Texas, Florida, California, New York, Georgia, North Carolina,
                Arizona, and Illinois.
              </p>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <LeadForm source="contact" submitLabel="Send My Message" />
          </div>
        </div>
      </Section>
    </>
  );
}
