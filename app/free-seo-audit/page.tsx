import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import LeadForm from "@/components/LeadForm";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free SEO Audit for US Businesses",
  description:
    "Get a free, no-obligation SEO audit of your website and Google Business Profile — see exactly where you're losing visibility and leads to competitors.",
  path: "/free-seo-audit/",
});

export default function FreeSeoAuditPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Free SEO Audit",
          description:
            "Get a free, no-obligation SEO audit of your website and Google Business Profile.",
          path: "/free-seo-audit/",
        })}
      />
      <PageHero
        eyebrow="Free SEO audit"
        title="See exactly where you're losing visibility and leads"
        description="We'll review your website, technical SEO, and Google Business Profile, then send you a straightforward breakdown of what's working, what's not, and what to fix first — no sales pitch required to get it."
        breadcrumbs={[{ name: "Free SEO Audit", path: "/free-seo-audit/" }]}
      />
      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-white">What's included in your audit</h2>
            <ul className="mt-6 space-y-4 text-sm text-white/60">
              <li>— On-page and technical SEO scan of your current website</li>
              <li>— Google Business Profile completeness and ranking check</li>
              <li>— Core Web Vitals and mobile usability snapshot</li>
              <li>— A short list of the highest-impact fixes, prioritized by effort vs. payoff</li>
              <li>— A quick look at how your top local competitors are showing up in search</li>
            </ul>
            <Card className="mt-8">
              <p className="text-sm text-white/55">
                This is a manual review by our team, not an automated report generator. Expect a
                reply within one business day with specific, actionable findings — not a generic
                PDF.
              </p>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <LeadForm source="free-seo-audit" submitLabel="Request My Free SEO Audit" />
          </div>
        </div>
      </Section>
    </>
  );
}
