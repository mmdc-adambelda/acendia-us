import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Full-Cycle Sales Closer — Commission Plan",
  description: "Real payout numbers for the Full-Cycle Sales Closer role at Acendia International.",
  path: "/careers/full-cycle-sales-closer/commission-plan/",
});

const BREAKDOWN = [
  { label: "Per confirmed sale", amount: "$200", note: "Base commission on every closed SEO Package sale ($499/mo)." },
  { label: "Per Social Add-On", amount: "$100", note: "Stacked on top. Attach it to every deal ($299/mo add-on)." },
  { label: "Total per deal", amount: "$300", highlight: true, note: "Core sale + Social Add-On sold together." },
];

const MATH_EXAMPLES = [
  { label: "1 sale + add-on", amount: "$300" },
  { label: "5 sales + add-on", amount: "$1,500" },
  { label: "10 sales + add-on", amount: "$3,000" },
];

const PAYOUT_STEPS = [
  { step: "1", title: "Setup Fee Paid", body: "Client signs on and pays the setup fee." },
  { step: "2", title: "Site Goes Live", body: "Website launches for the client." },
  { step: "3", title: "First Month Paid", body: "Client pays their first monthly payment." },
  { step: "4", title: "You Get Paid", body: "Commission released — approx. 14 days after go-live." },
];

export default function SalesCommissionPlanPage() {
  return (
    <>
      <PageHero
        eyebrow="Full-Cycle Sales Closer · Commission Plan"
        title="Close the deal. Earn $300."
        description="Every confirmed SEO Package + Social Add-On combo pays out $300 straight to you — base commission on the $499 SEO Package, plus a stacked bonus on every $299 Social Add-On you attach. All figures in USD."
        breadcrumbs={[
          { name: "Careers", path: "/careers/" },
          { name: "Full-Cycle Sales Closer", path: "/careers/full-cycle-sales-closer/" },
          { name: "Commission Plan", path: "/careers/full-cycle-sales-closer/commission-plan/" },
        ]}
      />

      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {BREAKDOWN.map((item) => (
            <Card
              key={item.label}
              className={item.highlight ? "border-white/40 bg-white/[0.06]" : undefined}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-white/45">{item.label}</p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white">{item.amount}</p>
              <p className="mt-2 text-sm text-white/60">{item.note}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Do the math</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MATH_EXAMPLES.map((item) => (
              <Card key={item.label} className="text-center">
                <p className="text-sm text-white/50">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--accent-2)]">{item.amount}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">How commission pays out</p>
          <p className="mt-3 text-sm text-white/60">
            Commission is earned when the client&apos;s first monthly payment clears — not at signature.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
            {PAYOUT_STEPS.map((s) => (
              <div key={s.step} className="relative">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-2)] text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-xs text-white/55">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-white/40">
            No commission is earned if a client cancels, never goes live, or does not pay the first monthly payment.
          </p>
        </div>

        <div className="mt-14 border-t border-[var(--border-dim)] pt-8">
          <Link
            href="/careers/full-cycle-sales-closer/"
            className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            ← Back to the Full-Cycle Sales Closer role
          </Link>
        </div>
      </Section>
    </>
  );
}
