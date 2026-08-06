import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

const article = ARTICLES.find((a) => a.slug === "technical-seo-audit-checklist")!;
const path = "/insights/technical-seo-audit-checklist/";

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path,
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
    mainEntityOfPage: `${SITE_URL}${path}`,
  };
}

export default function ArticlePage() {
  return (
    <>
      <JsonLd data={articleSchema()} />
      <PageHero
        eyebrow={`${article.readTime} · Technical SEO`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "Technical SEO Audit Checklist", path },
        ]}
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            "Technical SEO audit" means different things to different agencies, and a lot of what
            gets delivered under that name is a broken-link report with a logo on it. Here's what
            we think actually belongs in one, and why each piece matters.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">Crawlability and indexation first</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Before anything else: can search engines actually reach and index your important
              pages? This means checking robots.txt for accidental blocks, confirming your
              sitemap reflects reality, and reviewing Search Console's coverage report for pages
              that should be indexed but aren't — or pages that are indexed but shouldn't be.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Canonical and duplicate content review</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Inconsistent or missing canonical tags are one of the most common issues we find on
              sites that have gone through a redesign or migration. Every indexable page needs a
              single, clear, self-referencing canonical URL — not a canonical pointing to a
              staging domain or a different page entirely.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Site architecture and internal linking</h2>
            <p className="mt-3 text-sm leading-relaxed">
              A technical audit should map how link equity flows through your site. Orphaned
              pages with no internal links pointing to them are effectively invisible to search
              engines, no matter how good the content is.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Core Web Vitals, not just a PageSpeed score</h2>
            <p className="mt-3 text-sm leading-relaxed">
              A single PageSpeed Insights score is a starting point, not the full picture. A real
              audit looks at Largest Contentful Paint, Cumulative Layout Shift, and Interaction to
              Next Paint across your actual highest-traffic pages, on real-world mobile
              connections, not just a lab test on desktop.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Redirect chains and broken links</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This is the part most audits do cover, and it still matters: multi-hop redirect
              chains waste crawl budget and slow down users, and broken internal links quietly
              erode both user experience and link equity distribution.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Structured data validation</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Schema markup that doesn't validate — or worse, describes content that isn't
              actually visible on the page — can do more harm than having no schema at all. A
              proper audit validates every schema type against the current guidelines and the
              actual page content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Mobile usability under real conditions</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Beyond "is it responsive," a real audit checks tap target sizing, viewport
              configuration, and whether any content is clipped or overlapping at common device
              breakpoints — not just whether the layout technically reflows.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">What a good audit ends with</h2>
            <p className="mt-3 text-sm leading-relaxed">
              A technical SEO audit worth paying for ends with a prioritized list — not a
              200-item spreadsheet with no ranking of what actually matters. The goal is a clear
              answer to "what do we fix first, and why," not just an inventory of every possible
              issue.
            </p>
          </div>
        </article>
      </Section>
      <CTASection
        title="Want a real technical SEO audit, not a generic report?"
        description="Get a free SEO audit that prioritizes fixes by actual impact, not just issue count."
      />
    </>
  );
}
