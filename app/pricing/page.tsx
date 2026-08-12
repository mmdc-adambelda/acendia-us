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
import { POST_GOLIVE_BILLING_DELAY_DAYS } from "@/lib/billing";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "Transparent pricing for Acendia's SEO and digital growth services — a straightforward setup fee and monthly plan, no hidden costs.",
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
// when we know exactly what the real prices are. These mirror
// supabase/migrations/0003_seed_plans.sql exactly and only ever render
// when the live fetch comes back empty.
const FALLBACK_PLANS: ActivePlan[] = [
  {
    id: "fallback-seo-package",
    name: "SEO Package",
    slug: "growth-package",
    description:
      "Acendia's core SEO and digital growth engagement — a one-time setup followed by ongoing monthly work.",
    plan_type: "core",
    setup_fee_cents: 19900,
    monthly_price_cents: 49900,
    features: [
      "One-time setup and onboarding",
      "Ongoing SEO strategy and execution",
      "Local search and Google Business Profile optimization",
      "Monthly progress reporting",
      "Direct access to your account team via the client portal",
    ],
  },
  {
    id: "fallback-social-addon",
    name: "Social Media Add-On",
    slug: "social-media-addon",
    description: "Optional add-on for clients on the SEO Package who want ongoing social media management alongside their SEO work.",
    plan_type: "addon",
    setup_fee_cents: null,
    monthly_price_cents: 29900,
    features: ["Ongoing social media content and posting", "Managed as an add-on to an active Acendia plan"],
  },
];

const pricingFaqs = [
  {
    question: "Do I pay the full monthly plan today?",
    answer: `No. You pay only the one-time setup fee today. Your site typically goes live within 2-3 business days, and your first monthly payment isn't charged until ${POST_GOLIVE_BILLING_DELAY_DAYS} days after that — not before, and never bundled with the setup fee.`,
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer: "Specific contract terms are covered in your Acendia Service Agreement, provided before you sign up. SEO is a compounding investment, so we recommend planning for at least a few months to see meaningful results, but ask your account team for the exact terms that apply to your plan.",
  },
  {
    question: "What's included in the setup fee?",
    answer: "The setup fee covers onboarding — technical audit, account access setup, initial keyword and competitor research, and getting your campaign properly configured before ongoing monthly work begins.",
  },
  {
    question: "Can I add the Social Media Add-On later?",
    answer: "Yes — it's optional and can be added once you're an active client, from your billing settings in the client portal.",
  },
  {
    question: "Do you offer custom pricing for multi-location or larger businesses?",
    answer: "Yes — larger or multi-location businesses often need a scope beyond our standard plan. Contact our team for a custom strategy and quote.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We support major credit/debit cards via Stripe, PayPal, and Wise bank transfer. Full payment options are presented at checkout.",
  },
];

export default async function PricingPage() {
  const livePlans = await getActivePlans();
  const plans = livePlans.length > 0 ? livePlans : FALLBACK_PLANS;

  const corePlans = plans.filter((p) => p.plan_type !== "addon");
  const addonPlans = plans.filter((p) => p.plan_type === "addon");

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
        description="One clear setup fee, one monthly plan, and an optional add-on if you want it — not a maze of tiers designed to make comparison shopping difficult."
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
              {plan.setup_fee_cents !== null && (
                <p className="mt-1 text-sm text-white/50">+ {formatMoney(plan.setup_fee_cents)} one-time setup, due today</p>
              )}

              <ul className="mt-6 space-y-3">
                {plan.features?.map((f: string) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/65">
                    <span aria-hidden="true" className="mt-1 text-white/40">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button href="/register/" dataEvent="select_plan">
                  Start Growing
                </Button>
                <Button href="/contact/" variant="secondary">
                  Talk to Our Team
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {addonPlans.length > 0 && (
          <div className="mx-auto mt-8 max-w-md">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">Optional add-on</h3>
            {addonPlans.map((addon) => (
              <Card key={addon.id}>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-white">{addon.name}</h4>
                  {addon.monthly_price_cents !== null && (
                    <span className="text-sm text-white/60">{formatMoney(addon.monthly_price_cents)}/mo</span>
                  )}
                </div>
                {addon.description && <p className="mt-2 text-sm text-white/55">{addon.description}</p>}
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* How billing actually works — the piece visitors most often ask about */}
      <Section className="border-t border-[var(--border-dim)]">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>How billing works</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            You don&apos;t pay for a live site before it&apos;s live
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "Today",
                title: "Pay the setup fee",
                body: "That's the only charge at signup — your monthly plan is not billed yet.",
              },
              {
                step: "~2-3 business days",
                title: "Your site goes live",
                body: "Typical turnaround from the day you pay setup — timing can vary by project scope.",
              },
              {
                step: `${POST_GOLIVE_BILLING_DELAY_DAYS} days after go-live`,
                title: "Monthly billing starts",
                body: "Your first monthly charge lands exactly 14 days after your site is actually live, confirmed in your client portal.",
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
