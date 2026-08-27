import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getActivePlans, type ActivePlan } from "@/lib/plans";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "Transparent pricing for Acendia's SEO and digital growth services — one all-in monthly price, no setup fee, no hidden costs.",
  path: "/pricing/",
});

function formatMoney(cents: number | null) {
  if (cents === null) return null;
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: cents % 100 === 0 ? 0 : 2 })}`;
}

// This is the ONE dedicated, always-accurate pricing page — its numbers
// must never differ from what checkout actually charges. It normally
// pulls live from the `plans` table, but a database hiccup should never
// leave a visitor looking at an empty "pricing is being finalized" page
// when we know exactly what the real prices are. This mirrors the
// current $999/mo, no-setup-fee model and only ever renders when the
// live fetch comes back empty.
const FALLBACK_PLANS: ActivePlan[] = [
  {
    id: "fallback-seo-package",
    name: "SEO Package",
    slug: "growth-package",
    description: "Acendia's all-in SEO, website, and digital growth engagement — one monthly price, everything included.",
    plan_type: "core",
    setup_fee_cents: null,
    monthly_price_cents: 99900,
    stripe_price_id_monthly: null,
    features: [
      "NEW optimized website and Google Business Profile setup",
      "Ongoing strategy and execution",
      "Social media management",
      "Relevant keyword ranking",
      "Competitor gap analysis",
    ],
  },
];

const pricingFaqs = [
  {
    question: "Do I pay the full amount today?",
    answer: "Yes — your first month is billed today when you sign up, and it renews automatically at the same price every month after. There's no separate setup fee.",
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer: "Specific contract terms are covered in your Acendia Service Agreement, provided before you sign up. SEO is a compounding investment, so we recommend planning for at least a few months to see meaningful results, but ask your account team for the exact terms that apply to your plan.",
  },
  {
    question: "What's included in the $999/month?",
    answer: "Everything: a newly optimized website build, Google Business Profile setup, ongoing SEO strategy and execution, social media management, keyword ranking tracking, and a competitor gap analysis — one price, with nothing held back as a paid upsell.",
  },
  {
    question: "Do you offer custom pricing for multi-location or larger businesses?",
    answer: "Yes — larger or multi-location businesses often need a scope beyond our standard plan. Contact our team for a custom strategy and quote.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support major credit/debit cards via Stripe. If you need another payment arrangement for a custom or multi-location plan, contact our team.",
  },
];

export default async function PricingPage() {
  const livePlans = await getActivePlans();
  const plans = livePlans.length > 0 ? livePlans : FALLBACK_PLANS;
  const corePlans = plans.filter((p) => p.plan_type !== "addon");

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: "Pricing",
            description: "Transparent pricing for Acendia's SEO and digital growth services.",
            path: "/pricing/",
          }),
          faqSchema(pricingFaqs),
        ]}
      />
      <PageHero
        eyebrow="Pricing"
        title="Straightforward pricing, no hidden costs"
        description="One simple monthly price that includes everything — no separate setup fee, and nothing held back as a paid upsell."
        breadcrumbs={[{ name: "Pricing", path: "/pricing/" }]}
      />

      <Section>
        <div className="mx-auto grid max-w-md grid-cols-1 gap-6">
          {corePlans.map((plan) => (
            <Card key={plan.id} className="border-[var(--border-hi)] p-8">
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              {plan.description && <p className="mt-2 text-sm text-white/55">{plan.description}</p>}

              <div className="mt-6 flex items-baseline gap-2">
                {plan.monthly_price_cents !== null && (
                  <>
                    <span className="text-4xl font-semibold text-white">{formatMoney(plan.monthly_price_cents)}</span>
                    <span className="text-sm text-white/50">/month</span>
                  </>
                )}
              </div>
              {plan.setup_fee_cents === null && plan.monthly_price_cents !== null && (
                <p className="mt-1 text-sm text-white/50">Due today, then {formatMoney(plan.monthly_price_cents)}/month — no separate setup fee.</p>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features?.map((f: string) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-bold text-white">
                    <span aria-hidden="true" className="mt-0.5 text-white">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                {/* Real HTML form POST straight to Stripe checkout — same
                    "pay now, tell us who you are after" flow as the
                    homepage's "Join Now" button (see
                    app/api/get-started/checkout/route.ts). Not a Link to
                    /register/: that older flow still uses the separate
                    setup-fee-then-delayed-subscription billing model,
                    which no longer matches this page's advertised price. */}
                <form method="POST" action="/api/get-started/checkout" className="w-full">
                  <button
                    type="submit"
                    data-event="select_plan"
                    className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--glow-white)]"
                  >
                    Start Growing
                  </button>
                </form>
                <Button href="/contact/" variant="secondary">
                  Talk to Our Team
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* How billing actually works — the piece visitors most often ask about */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>How billing works</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            One price, billed today, renewing automatically
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "Today",
                title: "Your first month is billed",
                body: "That's the only charge at signup — no separate setup fee on top of it.",
              },
              {
                step: "~2-3 business days",
                title: "Your site goes live",
                body: "Typical build turnaround from the day you sign up — timing can vary by project scope.",
              },
              {
                step: "Every month after",
                title: "Billing renews automatically",
                body: "The same amount, on the same date each month — no proration surprises, no separate setup charge, ever.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/55">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Have a more complex business?</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Custom Strategy
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Multi-location businesses, franchises, and companies with an unusual scope don't always fit neatly into
            a self-service plan — talk to our team and we'll build a proposal around what you actually need.
          </p>
          <Button href="/contact/" variant="secondary" className="mt-8">
            Talk to Our Team
          </Button>
        </div>
      </Section>

      <Section className="border-t border-[var(--border-dim)]">
        <Eyebrow>Frequently asked questions</Eyebrow>
        <h2 className="mb-10 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Questions about pricing
        </h2>
        <div className="max-w-3xl">
          <FAQAccordion items={pricingFaqs} />
        </div>
      </Section>
    </>
  );
}
