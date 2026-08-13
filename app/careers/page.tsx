import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { JOBS } from "@/lib/careers";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description: "Join Acendia International — open roles for our remote, US-focused digital growth team.",
  path: "/careers/",
});

export default function CareersPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Careers",
          description: "Open roles at Acendia International.",
          path: "/careers/",
        })}
      />
      <PageHero
        eyebrow="Careers"
        title="Build the team behind US businesses' growth"
        description="Acendia is a remote-first digital growth agency serving businesses across the United States. Here's what we're hiring for right now."
        breadcrumbs={[{ name: "Careers", path: "/careers/" }]}
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-4">
          {JOBS.map((job) => (
            <Card key={job.slug} href={`/careers/${job.slug}/`} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                  <p className="mt-1 text-sm text-white/55">{job.oneLiner}</p>
                  <p className="mt-2 text-xs text-white/40">
                    {job.location} · {job.type}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${
                    job.status === "hiring"
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-[var(--border-hi)] text-white/50"
                  }`}
                >
                  {job.status === "hiring" ? "Hiring" : "Coming Soon"}
                </span>
              </div>
            </Card>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-white/40">
          Don&apos;t see a fit but think you'd be a good addition to the team? Email us at{" "}
          <a href="mailto:support@acendia.agency" className="text-white/70 underline hover:text-white">
            support@acendia.agency
          </a>
          .
        </p>
      </Section>
    </>
  );
}
