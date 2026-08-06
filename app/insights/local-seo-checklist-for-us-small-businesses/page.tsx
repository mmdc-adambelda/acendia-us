import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

const article = ARTICLES.find((a) => a.slug === "local-seo-checklist-for-us-small-businesses")!;

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: "/insights/local-seo-checklist-for-us-small-businesses/",
});

function articleSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/insights/local-seo-checklist-for-us-small-businesses/`,
  };
}

export default function ArticlePage() {
  return (
    <>
      <JsonLd data={articleSchema()} />
      <PageHero
        eyebrow={`${article.readTime} · Local SEO`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "Local SEO Checklist", path: "/insights/local-seo-checklist-for-us-small-businesses/" },
        ]}
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            Most local SEO advice tells you to "claim your Google Business Profile" and stops
            there. That's step one of about fifteen. If you run a local or multi-location US
            business, here's the checklist we actually walk clients through every quarter —
            in the order it matters.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">1. Confirm your Business Profile data hasn't drifted</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Business hours change for holidays and never get reset. Categories get edited by
              someone on the team who didn't know better. Photos go stale. Once a quarter, open
              your Google Business Profile and check: primary category, service area, hours,
              and that your most recent photos are actually current.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">2. Audit your citation consistency</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Your business name, address, and phone number (NAP) should match exactly across
              Google, Bing, Apple Maps, Yelp, and industry-specific directories. Even small
              inconsistencies — "St." vs. "Street" — create ranking friction over time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">3. Check review velocity, not just review count</h2>
            <p className="mt-3 text-sm leading-relaxed">
              A business with 40 reviews from two years ago looks less active to both customers
              and Google than one with 15 reviews trickling in weekly. Build a simple, consistent
              ask into your service completion process instead of running occasional review
              pushes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">4. Review your service-area pages for real specificity</h2>
            <p className="mt-3 text-sm leading-relaxed">
              If you serve multiple cities or neighborhoods, each location page needs to say
              something genuinely true and specific about that market — not just swap the city
              name into a template. Thin, duplicate location pages are one of the most common
              reasons local SEO stalls out.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">5. Check your Map Pack competitors, not just organic ones</h2>
            <p className="mt-3 text-sm leading-relaxed">
              The three businesses in the Map Pack for your top keyword are often not the same
              businesses ranking organically. Look at what they have that you don't: review
              count, categories, photos, or proximity — then decide what's actually fixable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Putting it into a routine</h2>
            <p className="mt-3 text-sm leading-relaxed">
              None of this is complicated on its own — the failure mode is usually that nobody
              owns it consistently. Block 90 minutes once a quarter, work through this list, and
              you'll catch most of the drift that quietly costs local businesses their rankings.
            </p>
          </div>
        </article>
      </Section>
      <CTASection
        title="Want us to run this audit for you?"
        description="Get a free SEO audit that covers your Google Business Profile, citations, and local page structure."
      />
    </>
  );
}
