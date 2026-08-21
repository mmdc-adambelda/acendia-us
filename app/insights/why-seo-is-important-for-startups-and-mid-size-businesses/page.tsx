import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { ARTICLES } from "@/lib/articles";

const article = ARTICLES.find(
  (a) => a.slug === "why-seo-is-important-for-startups-and-mid-size-businesses"
)!;
const path = "/insights/why-seo-is-important-for-startups-and-mid-size-businesses/";

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

const faqs = [
  {
    question: "Is SEO worth it for a brand-new startup with no traffic yet?",
    answer:
      "Yes, and arguably it matters more early — SEO takes months to build momentum, so a startup that starts on day one has a ranking foundation in place by the time it actually needs a steady lead pipeline instead of relying entirely on paid ads or outbound.",
  },
  {
    question: "How is SEO different for a mid-size business versus a large enterprise?",
    answer:
      "A mid-size business doesn't need hundreds of pages or an enterprise content team — it needs a focused set of pages that match how its actual buyers search, built on a clean technical foundation. Trying to out-produce a much larger competitor's content volume is usually the wrong fight; out-matching their relevance and specificity for the terms that actually convert is the right one.",
  },
  {
    question: "What's the biggest SEO mistake growing businesses make?",
    answer:
      "Treating it as a short-term campaign instead of a standing asset — running it hard for two or three months, seeing early traffic, and then pausing. Rankings built that way tend to plateau or slide back, because competitors who kept publishing and maintaining their technical foundation continue pulling ahead.",
  },
];

export default function ArticlePage() {
  return (
    <>
      <JsonLd data={[articleSchema(), faqSchema(faqs)]} />
      <PageHero
        eyebrow={`${article.readTime} · Growth Strategy`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "Why SEO Matters for Startups and Mid-Size Businesses", path },
        ]}
        image={{
          src: "/images/why-seo-important-startups-mid-size-featured.png",
          alt: "A business owner reviewing a Google search results page ranking above a competitor, alongside dashboards showing organic traffic and lead growth",
        }}
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            Startups and mid-size businesses share a specific constraint that enterprises don't:
            every marketing dollar has to justify itself quickly, but the business also has to
            survive long enough for slower, compounding channels to pay off. SEO is one of the
            few channels that solves both problems at once — if it's started early enough to
            matter.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Paid ads stop the moment the budget stops — SEO doesn't
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Every dollar spent on paid search buys exactly one batch of clicks, then the tap
              closes. A startup or growing business often can't sustain that spend indefinitely,
              especially while also funding product, hiring, or operations. A page that ranks
              organically keeps generating visits and leads every month it holds that position,
              at effectively zero marginal cost per click — which matters enormously when
              runway, not ad budget, is the actual constraint.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Startups compete on relevance and speed, not budget size
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              A newer or smaller company can't outspend an established competitor on brand
              advertising or a massive paid budget. But search rankings aren't purchased — they're
              earned through relevance, technical quality, and authority signals, which a focused
              startup can often build faster than a larger, slower-moving competitor whose site
              hasn't been meaningfully updated in years. SEO is one of the few channels where being
              smaller doesn't automatically mean losing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Mid-size businesses have outgrown word-of-mouth, but haven't earned brand-search
              volume yet
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Many mid-size businesses reach a specific, uncomfortable stage: too big to keep
              growing purely on referrals and word-of-mouth, but not yet a recognized enough
              brand for people to search for them by name. SEO is what fills that exact gap — it
              captures the customers who are actively searching for the solution but don't yet
              know your business exists, which is precisely the audience referrals can't reach.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              SEO builds an asset you own — not one you rent
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Every dollar spent on a rented channel — paid ads, a marketplace listing, a social
              platform's algorithm — disappears the moment you stop paying or the platform changes
              its rules. A well-built, technically sound website with genuine search authority is
              an asset the business owns outright. It's insulated (though never fully immune) from
              a single platform's policy shift, and it's one of the few marketing investments that
              still has value if you sell the business.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              The right time to start is before it's urgent
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              SEO typically takes 3-6 months to show meaningful traction and 6-12 months to
              become a reliable lead source. That means the businesses that benefit most are the
              ones that start before their pipeline actually runs dry — not the ones that turn to
              it in a panic after a slow quarter. Waiting until leads are urgently needed all but
              guarantees a gap between when the need shows up and when SEO can actually fill it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              What this looks like in practice at this stage
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              For a startup or mid-size business, effective SEO rarely means an enterprise-scale
              content operation publishing dozens of articles a month. It means a clean technical
              foundation (fast, crawlable, mobile-friendly), a focused set of pages built around
              the specific terms real buyers search, and — for locally-serving businesses — a
              fully optimized Google Business Profile. A smaller, sharply-targeted footprint
              consistently outperforms a large, unfocused one built without a real strategy behind
              it.
            </p>
          </div>
        </article>

        <div className="mt-14 max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>
      <CTASection
        title="Ready to build organic growth before you need it urgently?"
        description="Get a free SEO audit and a clear picture of where your site stands today."
      />
    </>
  );
}
