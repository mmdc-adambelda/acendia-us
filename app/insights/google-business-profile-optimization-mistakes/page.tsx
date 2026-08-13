import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

const article = ARTICLES.find((a) => a.slug === "google-business-profile-optimization-mistakes")!;
const path = "/insights/google-business-profile-optimization-mistakes/";

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
        eyebrow={`${article.readTime} · Google Business Profile`}
        title={article.title}
        description={article.description}
        breadcrumbs={[
          { name: "Insights", path: "/insights/" },
          { name: "GBP Mistakes", path },
        ]}
        image={{
          src: "/images/gbp-mistakes-featured.png",
          alt: "A Google Business Profile-style listing displayed on a laptop screen",
        }}
      />
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-8 text-white/70">
          <p className="text-base leading-relaxed">
            Google Business Profile is often the single highest-leverage local SEO asset a
            business has — and also the most neglected. These are the mistakes we see most often
            when auditing US business profiles, roughly in order of how much visibility they cost.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-white">1. Picking the wrong primary category</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Your primary category carries more ranking weight than almost any other profile
              field, and businesses frequently pick a category that's close but not quite right —
              "General Contractor" instead of "Roofing Contractor," for example. Get specific, and
              revisit it if your core service offering has shifted since you first set up the
              profile.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">2. Leaving the services section incomplete</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Many businesses fill out the basics and never touch the services list again. A
              complete, specific services list helps Google match your profile to more of the
              specific searches your customers actually run.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">3. Letting reviews go unanswered</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Unanswered reviews — especially negative ones — signal an inactive, disengaged
              business to both customers and Google. A prompt, professional response to every
              review (positive or negative) is one of the easiest wins available.
            </p>
          </div>

          <div className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)]">
            <Image
              src="/images/gbp-mistakes-content.png"
              alt="A small business owner replying to a customer review on a smartphone in their storefront"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">4. Using outdated or generic photos</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Stock photos or images from years ago undercut trust the moment a prospective
              customer clicks into your profile. Recent, real photos of your team, location, and
              completed work perform meaningfully better.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">5. Ignoring the Q&A section</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Anyone can post a question on your profile, and anyone can answer it — including
              competitors or bad-faith actors. Proactively seeding a few genuinely useful Q&As and
              monitoring for new ones prevents this section from working against you.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">6. Never posting an update</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Google Posts are a low-effort, underused way to signal an active, engaged business.
              A profile that hasn't posted in a year looks stagnant next to a competitor posting
              weekly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">7. Mismatched hours across platforms</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Hours that don't match between your Business Profile, website, and other directories
              create a bad first impression and a real trust signal problem — for customers and
              for Google's confidence in the accuracy of your listing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">The fix is usually simple, just neglected</h2>
            <p className="mt-3 text-sm leading-relaxed">
              None of these require a big project — most take under an hour to fix once you know
              to look for them. The real fix is treating your profile as an ongoing asset that
              needs regular attention, not a one-time setup task.
            </p>
          </div>
        </article>
      </Section>
      <CTASection
        title="Want us to check your profile for these mistakes?"
        description="Get a free SEO audit that includes a full Google Business Profile review."
      />
    </>
  );
}
