import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { TAGLINE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Acendia",
  description:
    "Acendia is an AI-native digital growth agency helping US businesses improve search visibility, win local customers, and generate qualified leads.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "About Acendia",
          description: "Acendia is an AI-native digital growth agency helping US businesses grow through SEO and digital marketing.",
          path: "/about/",
        })}
      />
      <PageHero
        eyebrow="About Acendia"
        title="An AI-native growth partner for US businesses"
        description="Acendia is part of a small, international group of digital growth agencies. Our US practice is built specifically around how American businesses search, compete, and buy — SEO, local search, and website conversion, backed by AI-assisted execution."
        breadcrumbs={[{ name: "About", path: "/about/" }]}
      />

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Why Acendia exists</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">
              Marketing agencies are slow. Search doesn&apos;t wait.
            </h2>
            <p className="mt-5 text-white/60">
              Traditional agencies are often bottlenecked by manual research, slow reporting
              cycles, and generic playbooks. We built Acendia around a different premise: pair
              experienced strategists with AI-assisted workflows so audits, content research, and
              reporting happen faster — without cutting corners on judgment or quality control.
            </p>
          </div>
          <div>
            <Eyebrow>What "AI-native" actually means here</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">
              AI accelerates the work. People still own the strategy.
            </h2>
            <p className="mt-5 text-white/60">
              We use AI tools to speed up technical audits, keyword research, and structured data
              — the repetitive, time-intensive parts of SEO. Every recommendation, piece of
              content, and strategic decision is still reviewed by a person before it reaches
              your business.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="mb-12 max-w-2xl">
          <Eyebrow>How we operate</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What you can expect from working with us
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Straight talk on timelines", body: "SEO compounds — we tell you what to expect at 30, 90, and 180 days instead of overselling week-one results." },
            { title: "Transparent reporting", body: "Monthly reports tie directly to rankings, traffic, and leads — not vanity metrics." },
            { title: "Built to your market", body: "Strategy is shaped around your city, state, and industry — not a copy-paste template." },
            { title: "No fabricated proof", body: "We won't invent testimonials, results, or awards. If we don't have verified proof yet, we say so." },
            { title: "Remote-first, nationwide", body: "We work with businesses across the US without requiring a physical office visit." },
            { title: "One connected system", body: "SEO, website, and content work together instead of living in separate silos." },
          ].map((item) => (
            <Card key={item.title}>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/55">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Our promise</Eyebrow>
          <p className="text-balance text-2xl font-medium text-white sm:text-3xl">{TAGLINE}</p>
          <p className="mt-4 text-white/60">
            Your growth is the only metric that matters to us. Every audit, recommendation, and
            piece of content is built around what actually moves your business forward.
          </p>
        </div>
      </Section>

      <CTASection
        title="Want to see how we'd approach your market?"
        description="Get a free SEO audit and a straightforward look at where your biggest opportunities are."
      />
    </>
  );
}
