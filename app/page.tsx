import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Section, { Eyebrow } from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";
import IndustryGrid from "@/components/IndustryGrid";
import CTASection from "@/components/CTASection";
import FAQAccordion from "@/components/FAQAccordion";
import Card from "@/components/Card";
import PricingPreviewWidget from "@/components/PricingPreviewWidget";
import HeroOrbitalBackground from "@/components/HeroOrbitalBackground";
import HomepageVideoSection from "@/components/HomepageVideoSection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { PRIORITY_CITIES, PRIORITY_STATES, TAGLINE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  // The homepage shares a route segment with the root layout, so Next's
  // title.template (applied to nested child segments) doesn't reach it —
  // spell out the full title here instead of relying on that template.
  title: "Acendia International | SEO & Digital Growth Agency for US Businesses",
  description:
    "Acendia helps US businesses grow search visibility, win local customers, and generate qualified leads through SEO, high-converting websites, and AI-powered marketing.",
  path: "/",
});

const homeFaqs = [
  {
    question: "How is Acendia different from a typical SEO agency?",
    answer:
      "We combine hands-on SEO strategy with AI-assisted execution — meaning faster technical audits, content built around real search intent, and reporting that ties directly back to leads, not just rankings. Every engagement is built around your specific market and industry, not a one-size-fits-all package.",
  },
  {
    question: "What size of business do you typically work with?",
    answer:
      "Most of our clients are established local and multi-location businesses — home services companies, law firms, healthcare practices, real estate teams, and professional service firms — that already have paying customers and want to reduce their dependence on paid lead platforms.",
  },
  {
    question: "Do you guarantee first-page rankings?",
    answer:
      "No agency can honestly guarantee a specific ranking position — search algorithms are outside anyone's direct control. What we do commit to is a documented strategy, transparent monthly reporting, and a process built on technical SEO fundamentals and genuine content quality.",
  },
  {
    question: "How long does SEO take to show results?",
    answer:
      "Most businesses start seeing measurable movement in visibility and traffic within 90 to 180 days, with compounding results after that. Local SEO and Google Business Profile improvements can move faster than competitive national terms.",
  },
  {
    question: "Do you offer website design as well as SEO?",
    answer:
      "Yes. A high-ranking website that doesn't convert is a wasted opportunity, so we design and build sites with SEO, speed, and conversion rate in mind from the first wireframe.",
  },
  {
    question: "Which US markets do you serve?",
    answer:
      "We work with businesses across the United States and currently focus our deepest market research on Texas, Florida, California, New York, Georgia, North Carolina, Arizona, and Illinois, with coverage expanding steadily to additional states and cities.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: "Acendia International | SEO & Digital Growth Agency for US Businesses",
            description:
              "Acendia helps US businesses grow search visibility, win local customers, and generate qualified leads through SEO, high-converting websites, and AI-powered marketing.",
            path: "/",
          }),
          faqSchema(homeFaqs),
        ]}
      />

      {/* Hero */}
      <div className="bg-grid relative overflow-hidden border-b border-[var(--border-dim)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.10),transparent_55%)]"
        />
        <HeroOrbitalBackground />
        <Section className="relative py-16 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="relative mb-6 w-[140px] sm:w-[170px] lg:w-[190px]">
                <Image
                  src="/brand/acendia-logo-white.png"
                  alt="Acendia"
                  width={200}
                  height={113}
                  priority
                  className="hero-logo-glow h-auto w-full"
                />
                {/* Decorative shimmer sweep, masked to the logo's own alpha
                    shape so the highlight only ever plays across the actual
                    letterforms/icon — never a rectangle. Falls back to fully
                    invisible (not a solid block) on browsers without
                    mask-image support, via the @supports gate in
                    globals.css, so the real <Image> above is always what
                    carries the logo either way. */}
                <span
                  aria-hidden="true"
                  className="hero-logo-shine"
                  style={{ "--hero-logo-mask": "url(/brand/acendia-logo-white.png)" } as CSSProperties}
                />
              </div>
              <Eyebrow>Digital growth agency · United States</Eyebrow>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn Search Visibility Into Real Business Growth
              </h1>
              <p className="text-balance mt-6 max-w-xl text-lg text-white/60">
                Acendia helps US businesses improve search rankings, dominate local markets, and
                generate qualified leads through SEO, high-converting websites, and AI-powered
                growth systems.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/free-seo-audit/" dataEvent="audit_cta_clicked">
                  Get Your Free SEO Audit
                </Button>
                <Button href="/services/" variant="secondary">
                  Explore Our Services
                </Button>
              </div>
              <p className="mt-8 text-sm font-medium tracking-wide text-white/40">{TAGLINE}</p>
            </div>
            <PricingPreviewWidget />
          </div>
        </Section>
      </div>

      <HomepageVideoSection />

      {/* Problem */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Most US businesses are invisible where it matters most
          </h2>
          <p className="text-balance mt-5 text-lg text-white/60">
            Your best customers are already searching for what you offer — on Google, in Maps,
            and increasingly through AI-generated answers. If your site is slow, your Google
            Business Profile is thin, or your content doesn&apos;t match how people actually
            search, competitors with weaker offerings are winning the click instead.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Buried in local search",
              body: "Ranking on page two means being functionally invisible to nearby customers ready to buy.",
            },
            {
              title: "Traffic that doesn't convert",
              body: "An outdated or slow website turns paid and organic visitors away before they ever call or fill out a form.",
            },
            {
              title: "Left out of AI search",
              body: "AI-generated answers increasingly summarize competitors instead of citing your business at all.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/55">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Eleven services. One connected growth system.
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Every service is built to work together — SEO drives visibility, conversion-focused
            design captures the click, and AI-assisted reporting keeps the whole system honest.
          </p>
        </div>
        <ServiceGrid />
      </Section>

      {/* How it works */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>How Acendia works</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A four-stage growth process, not a black box
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Audit & Benchmark",
              body: "We assess your technical SEO, Google Business Profile, competitors, and website conversion path.",
            },
            {
              step: "02",
              title: "Build the Strategy",
              body: "You get a prioritized roadmap tied to your market, industry, and revenue goals — not a generic checklist.",
            },
            {
              step: "03",
              title: "Execute & Optimize",
              body: "Our team and AI-assisted workflows handle technical fixes, content, and local optimization on a set cadence.",
            },
            {
              step: "04",
              title: "Report & Scale",
              body: "Monthly reporting ties directly to leads and rankings so we can double down on what's working.",
            },
          ].map((item) => (
            <div key={item.step}>
              <span className="text-sm font-semibold text-white/30">{item.step}</span>
              <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI-native advantage */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The AI-native advantage</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Human strategy. AI-assisted execution.
            </h2>
            <p className="mt-5 text-lg text-white/60">
              We use AI tools to speed up technical audits, content research, and reporting — but
              strategy, quality control, and account management stay in human hands. That means
              faster turnarounds without sacrificing judgment.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              <li>— Faster technical SEO audits across large sites</li>
              <li>— Content built around real, current search intent</li>
              <li>— Structured data built for both search engines and AI answer engines</li>
              <li>— Reporting that highlights what actually moved the needle</li>
            </ul>
          </div>
          <Card className="p-8">
            <h3 className="text-lg font-semibold text-white">Built for how search is changing</h3>
            <p className="mt-3 text-sm text-white/55">
              Search no longer ends at ten blue links. Voice assistants, AI Overviews, and chat-based
              answer engines are pulling from structured, well-organized content. We build your site
              so it&apos;s legible to both — clean schema, clear entities, and content that actually
              answers the question being asked.
            </p>
          </Card>
        </div>
      </Section>

      {/* Industries */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Who we help</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for industries where one lead has real value
          </h2>
          <p className="mt-4 text-lg text-white/60">
            We focus on businesses where local search visibility translates directly into booked
            jobs, signed contracts, or new patients.
          </p>
        </div>
        <IndustryGrid />
      </Section>

      {/* Locations */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow>Where we work</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Serving businesses across the United States
            </h2>
            <p className="mt-4 text-lg text-white/60">
              We work remotely with businesses nationwide, with the deepest local market research
              currently focused on these priority states.
            </p>
          </div>
          <Link
            href="/locations/"
            className="focus-ring shrink-0 text-sm font-medium text-white/70 hover:text-white"
          >
            View all locations →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {PRIORITY_STATES.map((state) => (
            <Link
              key={state}
              href={`/locations/${state.toLowerCase().replace(/\s+/g, "-")}/`}
              className="focus-ring rounded-full border border-[var(--border)] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[var(--border-hi)] hover:text-white"
            >
              {state}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRIORITY_CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/locations/${c.stateSlug}/${c.slug}/`}
              className="focus-ring rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              {c.city}, {c.state}
            </Link>
          ))}
        </div>
      </Section>

      {/* Case studies placeholder */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Proof, once it exists</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Results are coming soon — we won&apos;t fabricate them in the meantime
          </h2>
          <p className="mt-4 text-lg text-white/60">
            We&apos;d rather show you a placeholder than an invented case study. Verified client
            results will be published here as engagements complete.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {["Home Services", "Legal", "Healthcare"].map((label) => (
            <Card key={label} className="flex h-40 items-center justify-center">
              <span className="text-sm font-medium uppercase tracking-wide text-white/30">
                {label} case study — coming soon
              </span>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Frequently asked questions</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Questions US business owners ask us first
          </h2>
        </div>
        <div className="max-w-3xl">
          <FAQAccordion items={homeFaqs} />
        </div>
      </Section>

      <CTASection
        title="Ready to see what's holding your search visibility back?"
        description="Get a free, no-obligation SEO audit and a clear picture of where you're losing leads to competitors."
      />
    </>
  );
}
