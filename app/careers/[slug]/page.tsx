import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import JsonLd from "@/components/JsonLd";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { jobPostingSchema, webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { JOBS, getJob } from "@/lib/careers";

export function generateStaticParams() {
  return JOBS.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) return buildMetadata({ title: "Careers", description: "Open roles at Acendia International.", path: "/careers/" });
  return buildMetadata({
    title: `${job.title} — Careers`,
    description: job.oneLiner,
    path: `/careers/${job.slug}/`,
  });
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
          <span aria-hidden="true" className="mt-1 text-white/40">
            —
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const path = `/careers/${job.slug}/`;
  // A 90-day validity window from today, refreshed whenever this file is
  // touched — reasonable default for a rolling commission-based opening
  // that isn't tied to a single hard deadline.
  const validThrough = job.datePosted
    ? new Date(new Date(job.datePosted).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: job.title, description: job.oneLiner, path }),
          ...(job.status === "hiring" && job.content && job.datePosted && validThrough
            ? [
                jobPostingSchema({
                  title: job.title,
                  description: job.content.intro,
                  datePosted: job.datePosted,
                  validThrough,
                  employmentType: "CONTRACTOR",
                  path,
                }),
              ]
            : []),
        ]}
      />
      <PageHero
        eyebrow={`${job.location} · ${job.type}`}
        title={job.title}
        description={job.oneLiner}
        breadcrumbs={[
          { name: "Careers", path: "/careers/" },
          { name: job.title, path },
        ]}
      >
        <span
          className={`mt-6 inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${
            job.status === "hiring"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-[var(--border-hi)] text-white/50"
          }`}
        >
          {job.status === "hiring" ? "Hiring" : "Coming Soon"}
        </span>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {job.status === "hiring" && job.content ? (
              <article className="space-y-8">
                <p className="text-base leading-relaxed text-white/70">{job.content.intro}</p>

                <div>
                  <h2 className="text-lg font-semibold text-white">Your Responsibilities</h2>
                  <List items={job.content.responsibilities} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">What We Are Looking For</h2>
                  <List items={job.content.lookingFor} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">Compensation</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{job.content.compensation.intro}</p>
                  <List items={job.content.compensation.bullets} />
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{job.content.compensation.closing}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">Why Join Acendia?</h2>
                  <List items={job.content.whyJoin} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">Performance Expectations</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">You will be expected to consistently:</p>
                  <List items={job.content.performanceExpectations} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">How to Apply</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{job.content.howToApply.intro}</p>
                  <List items={job.content.howToApply.bullets} />
                </div>

                <p className="text-sm font-medium text-white/80">{job.content.closing}</p>
              </article>
            ) : (
              <Card>
                <h2 className="text-lg font-semibold text-white">This role isn&apos;t open yet</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  We&apos;re planning to grow our team with a {job.title} role. We don&apos;t have full details to
                  share yet, but if you&apos;d like to be considered early, submit your CV using the form and we&apos;ll
                  reach out once the position opens.
                </p>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card>
                <h2 className="text-base font-semibold text-white">
                  {job.status === "hiring" ? "Apply for this role" : "Submit your CV for early consideration"}
                </h2>
                <div className="mt-5">
                  <ApplicationForm
                    jobSlug={job.slug}
                    jobTitle={job.title}
                    submitLabel={job.status === "hiring" ? "Submit Application" : "Submit CV"}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
