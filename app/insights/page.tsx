import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description:
    "SEO, local search, and digital growth insights for US business owners — practical guidance, not recycled listicles.",
  path: "/insights/",
});

export default function InsightsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Insights",
          description: "SEO, local search, and digital growth insights for US business owners.",
          path: "/insights/",
        })}
      />
      <PageHero
        eyebrow="Insights"
        title="Practical SEO and growth guidance for US business owners"
        description="No recycled listicles — just the specific, actionable guidance we'd give a client."
        breadcrumbs={[{ name: "Insights", path: "/insights/" }]}
      />
      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) =>
            article.published ? (
              <Card key={article.slug} href={`/insights/${article.slug}/`}>
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                  {article.readTime}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-white">{article.title}</h2>
                <p className="mt-2 text-sm text-white/55">{article.description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-white/70">
                  Read article →
                </span>
              </Card>
            ) : (
              <Card key={article.slug} className="opacity-60">
                <p className="text-xs font-medium uppercase tracking-wide text-white/40">
                  Coming soon
                </p>
                <h2 className="mt-3 text-lg font-semibold text-white/80">{article.title}</h2>
                <p className="mt-2 text-sm text-white/45">{article.description}</p>
              </Card>
            )
          )}
        </div>
        <p className="mt-10 text-sm text-white/40">
          Have a topic you'd like us to cover?{" "}
          <Link href="/contact/" className="underline hover:text-white">
            Let us know
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
