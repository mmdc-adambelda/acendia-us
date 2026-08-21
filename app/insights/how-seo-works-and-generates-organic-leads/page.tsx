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

const article = ARTICLES.find((a) => a.slug === "how-seo-works-and-generates-organic-leads")!;
const path = "/insights/how-seo-works-and-generates-organic-leads/";

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
    question: "How long does SEO take to generate leads?",
    answer:
      "Most sites see early ranking movement in 3-4 months, with meaningful lead volume building between months 6 and 12. Competitive terms and newer domains typically sit at the longer end of that range. It's slower than paid ads on day one, but the traffic keeps arriving without paying for each click.",
  },
  {
    question: "Does ranking #1 actually matter, or just being on page one?",
    answer:
      "Position matters, but intent match matters more. A #4 ranking on a page that answers exactly what the searcher wants — with a clear next step — will out-convert a #1 ranking on a page that's technically relevant but doesn't address why someone searched.",
  },
  {
    question: "Can SEO work without any content marketing?",
    answer:
      "For businesses with strong local or transactional intent (most home services, healthcare, and local retail), technical SEO plus Google Business Profile optimization can carry a lot of the lead volume on its own. Content marketing matters more for informational-intent industries and for competing on broader, higher-volume terms.",
  },
];

export default function ArticlePage() {
  return (
    <>
      <JsonLd data={[articleSchema(), faqSchema(faqs)]} />
      <PageHero
        eyebrow={`${article.readTime} · SEO Fundamentals`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "How SEO Works and Generates Organic Leads", path },
        ]}
        placeholderIcon="search"
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            Most explanations of SEO stop at "get your site to rank higher on Google." That's the
            mechanism, not the point. The point is that a business owner needs their phone to ring
            or their form to get filled — and SEO is the process of building the specific,
            durable path that turns a stranger's search into that outcome. Here's how each stage
            of that path actually works.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Step one: search engines have to find and understand your page
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Before any keyword or ranking factor matters, Google has to be able to crawl your
              site and index the page in question. That depends on things most business owners
              never see: a clean site structure, a sitemap that reflects reality, no accidental
              blocks in robots.txt, and internal links that actually point to the page you want
              found. A page with none of these can be well-written and still be functionally
              invisible.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Step two: rankings are earned through relevance and trust, not just keywords
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Once a page is indexed, Google ranks it based on how well it matches what the
              searcher is actually trying to do (search intent), how authoritative and
              trustworthy the site appears (backlinks, reviews, consistent business information,
              expertise signals), and how good the on-page experience is (load speed, mobile
              usability, clear structure). Keyword usage still matters, but stuffing a page with
              a phrase no longer moves rankings the way it did a decade ago — matching intent
              does.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Step three: matching intent, not just topic
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Every keyword carries an intent — informational ("how does X work"), commercial
              ("best X for Y"), or transactional ("X near me," "hire X"). Ranking for
              high-volume informational terms can build traffic and authority, but it's the
              commercial and transactional terms that turn into leads, because that's what
              someone ready to act is actually typing. A real SEO strategy targets both: broader
              terms to build topical authority and traffic, narrower high-intent terms to
              generate the leads themselves.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Step four: the page itself has to convert the visit
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              Ranking gets someone to the page. It doesn't make them call. That's on the page's
              conversion path — a clear value proposition above the fold, a visible and obvious
              next step (call button, form, booking link), trust signals like reviews or case
              studies, and load speed fast enough that the visitor doesn't leave before any of it
              renders. A page that ranks well but converts poorly is generating traffic, not
              leads — and traffic alone doesn't pay the bills.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Why SEO compounds instead of resetting to zero
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              This is the mechanical difference between SEO and paid ads: an ad stops generating
              leads the moment the budget stops. A page that ranks keeps generating leads every
              month it holds that position, with no additional spend per click. Backlinks and
              authority earned for one page also lift the domain's overall trust, which makes
              every other page on the site easier to rank — so the tenth article published tends
              to rank faster than the first one did, not slower.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              For local businesses, Google Business Profile is part of the same system
            </h2>
            <p className="mt-3 text-sm leading-relaxed">
              For any business serving a local area, the Map Pack (the three-listing block shown
              above organic results) is often the highest-intent real estate on the page. It runs
              on a related but distinct set of signals — profile completeness, categories,
              reviews, and proximity — and generating local leads through SEO means optimizing
              both the website's organic rankings and the Google Business Profile together, not
              treating them as separate projects.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">What "SEO is working" actually looks like</h2>
            <p className="mt-3 text-sm leading-relaxed">
              In the first 1-3 months: technical fixes go live and indexation improves, but
              ranking movement is usually minimal. By months 3-6: target keywords start
              appearing on page one for lower-competition terms, and organic traffic begins a
              visible upward trend. By months 6-12: higher-intent and more competitive terms
              start ranking, and organic traffic converts into a consistent, trackable stream of
              leads rather than occasional ones. Anyone promising page-one rankings inside
              4 weeks is either targeting terms with no real competition or not being straight
              with you.
            </p>
          </div>
        </article>

        <div className="mt-14 max-w-3xl">
          <FAQAccordion items={faqs} />
        </div>
      </Section>
      <CTASection
        title="Want to know where your site actually stands?"
        description="Get a free SEO audit that shows exactly what's blocking your rankings and organic leads today."
      />
    </>
  );
}
