import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";
import { faqSchema, itemListSchema } from "@/lib/schema";

const article = ARTICLES.find((a) => a.slug === "local-seo-checklist-for-us-small-businesses")!;
const path = "/insights/local-seo-checklist-for-us-small-businesses/";

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path,
});

const CHECKLIST_ITEMS: {
  title: string;
  body: string;
  link?: { href: string; label: string; prefix: string };
}[] = [
  {
    title: "Confirm your Business Profile data hasn't drifted",
    body: "Business hours change for holidays and never get reset. Categories get edited by someone on the team who didn't know better. Photos go stale. Once a quarter, open your Google Business Profile and check: primary category, service area, hours, and that your most recent photos are actually current.",
    link: {
      href: "/insights/google-business-profile-optimization-mistakes/",
      prefix: "If you catch a wrong category or a stale photo, see our breakdown of ",
      label: "common Google Business Profile mistakes",
    },
  },
  {
    title: "Audit your citation consistency",
    body: "Your business name, address, and phone number (NAP) should match exactly across Google, Bing, Apple Maps, Yelp, and industry-specific directories. Even small inconsistencies — \"St.\" vs. \"Street,\" a disconnected old phone number, a suite number dropped on one listing — create ranking friction over time. A quick manual check: search your exact business name plus city and scan the first two pages of results for anything that doesn't match.",
  },
  {
    title: "Check review velocity, not just review count",
    body: "A business with 40 reviews from two years ago looks less active to both customers and Google than one with 15 reviews trickling in weekly. Build a simple, consistent ask into your service completion process — a text or email sent within 24 hours of the job finishing converts far better than an occasional bulk review push.",
  },
  {
    title: "Review your service-area pages for real specificity",
    body: "If you serve multiple cities or neighborhoods, each location page needs to say something genuinely true and specific about that market — not just swap the city name into a template. Thin, duplicate location pages are one of the most common reasons local SEO stalls out, and Google's Helpful Content system is increasingly good at spotting them.",
  },
  {
    title: "Check your Map Pack competitors, not just organic ones",
    body: "The three businesses in the Map Pack for your top keyword are often not the same businesses ranking organically. Look at what they have that you don't: review count, category selection, photo volume, or proximity to the searcher — then decide what's actually fixable versus what's a structural advantage you can't change.",
  },
];

const faqs = [
  {
    question: "What is local SEO?",
    answer:
      "Local SEO is the practice of optimizing a business's online presence so it shows up in location-based searches — Google's Map Pack, Google Maps, and localized organic results — for queries like \"near me\" or \"[service] in [city].\" It's distinct from traditional SEO in what it optimizes: Google Business Profile accuracy, citation consistency across directories, proximity to the searcher, and review signals matter far more here than they do for national keyword rankings.",
  },
  {
    question: "How is local SEO different from traditional SEO?",
    answer:
      "Traditional SEO ranks a website in general organic search results based mostly on content relevance, backlinks, and technical site quality. Local SEO adds a location layer on top: your Google Business Profile, NAP (name, address, phone) consistency across the web, proximity to the searcher, and review volume/recency all directly influence whether you appear in the Map Pack — a ranking factor set that doesn't apply to a purely informational or national query.",
  },
  {
    question: "How often should I run a local SEO checklist like this one?",
    answer:
      "Quarterly is the right cadence for most single-location and small multi-location businesses — frequent enough to catch drift (stale hours, an edited category, a citation gone out of sync) before it costs meaningful visibility, without turning into unnecessary busywork.",
  },
  {
    question: "Do I need a website to rank in local search?",
    answer:
      "You don't strictly need a website to appear in the Map Pack, since Google Business Profile can rank on its own — but a real website strengthens nearly every other local SEO signal (service-area pages, content depth, technical trust) and is required to compete for the organic local results that sit alongside the Map Pack.",
  },
];

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
      <JsonLd
        data={[
          articleSchema(),
          itemListSchema({
            name: "Local SEO Checklist",
            items: CHECKLIST_ITEMS.map((item) => ({ name: item.title, description: item.body })),
          }),
          faqSchema(faqs),
        ]}
      />
      <PageHero
        eyebrow={`${article.readTime} · Local SEO`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "Local SEO Checklist", path },
        ]}
        image={{
          src: "/images/local-seo-checklist-featured.png",
          alt: "A small business owner checking local search results on a tablet in their storefront",
        }}
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            Most local SEO advice tells you to "claim your Google Business Profile" and stops
            there. That's step one of about fifteen. If you run a local or multi-location{" "}
            <Link href="/locations/" className="text-white underline underline-offset-2 hover:text-white/80">
              US business
            </Link>
            , here's the checklist we actually walk clients through every quarter — in the order
            it matters.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">What is local SEO?</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Local SEO is the practice of optimizing your business's online presence so it shows
              up when people search for what you offer near a specific location — in Google's Map
              Pack (the three businesses shown with a map at the top of a local search), Google
              Maps itself, and localized organic results for queries like "plumber near me" or
              "roofing contractor in Austin."
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              It's a distinct discipline from traditional SEO, not just a smaller version of it.
              Where national organic rankings lean heavily on content relevance and backlinks,
              local rankings weigh a different set of signals most heavily: your{" "}
              <Link href="/services/google-business-profile-optimization/" className="text-white underline underline-offset-2 hover:text-white/80">
                Google Business Profile
              </Link>{" "}
              accuracy, citation consistency across directories, physical proximity to the
              searcher, and review volume and recency. A business can rank well nationally and
              still be invisible in its own city's Map Pack if those local-specific signals are
              neglected — which is exactly what the checklist below is built to catch.
            </p>
          </div>

          {CHECKLIST_ITEMS.map((item, i) => (
            <div key={item.title}>
              <h2 className="flex items-start gap-3 text-xl font-semibold text-white">
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white bg-white text-xs font-bold text-black"
                >
                  {i + 1}
                </span>
                {item.title}
              </h2>
              <p className="mt-3 pl-9 text-sm leading-relaxed">{item.body}</p>
              {item.link && (
                <p className="mt-2 pl-9 text-sm leading-relaxed text-white/50">
                  {item.link.prefix}
                  <Link href={item.link.href} className="text-white underline underline-offset-2 hover:text-white/80">
                    {item.link.label}
                  </Link>
                  .
                </p>
              )}
            </div>
          ))}

          <div className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)]">
            <Image
              src="/images/local-seo-checklist-content.png"
              alt="A small business owner cross-referencing business directory listings against a printed local map"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Putting it into a routine</h2>
            <p className="mt-3 text-sm leading-relaxed">
              None of this is complicated on its own — the failure mode is usually that nobody
              owns it consistently. Block 90 minutes once a quarter, work through this list, and
              you'll catch most of the drift that quietly costs local businesses their rankings.
              If you'd rather have someone else own this permanently, that's exactly what our{" "}
              <Link href="/services/local-seo/" className="text-white underline underline-offset-2 hover:text-white/80">
                local SEO service
              </Link>{" "}
              does.
            </p>
          </div>
        </article>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </Section>

      <CTASection
        title="Want us to run this audit for you?"
        description="Get a free SEO audit that covers your Google Business Profile, citations, and local page structure."
      />
    </>
  );
}
