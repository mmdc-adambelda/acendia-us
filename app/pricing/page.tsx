import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section, { Eyebrow } from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { webPageSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getActivePlans } from "@/lib/plans";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "Transparent pricing for Acendia's SEO and digital growth services — a straightforward setup fee and monthly plan, no hidden costs.",
  path: "/pricing/",
});

function formatMoney(cents: number | null) {
  if (cents === null) return null;
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: cents % 100 === 0 ? 0 : 2 })}`;
}

const pricingFaqs = [
  {
    question: "Is there a contract or minimum commitment?",
    answer: "Specific contract terms are covered in your Acendia Service Agreement, provided before you sign up. SEO is a compounding investment, so we recommend planning for at least a few months to see meaningful results, but ask your account team for the exact terms that apply to your plan.",
  },
  {
    question: "What's included in the setup fee?",
    answer: "The setup fee covers onboarding — technical audit, account access setup, initial keyword and competitor research, and getting your campaign properly configured before ongoing monthly work begins.",
  },
  {
    question: "Can I add Social Media Management later?",
    answer: "Yes — it's an optional add-on to your core plan and can be added once you're an active client, from your billing settings in the client portal.",
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
  const plans = await getActivePlans();

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
        {corePlans.length === 0 ? (
          <Card className="mx-auto max-w-lg text-center">
            <p className="text-white/60">
              Pricing is being finalized — contact our team for current rates and availability.
            </p>
            <Button href="/contact/" className="mt-6">
              Talk to Our Team
            </Button>
          </Card>
        ) : (
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
                  <p className="mt-1 text-sm text-white/50">+ {formatMoney(plan.setup_fee_cents)} one-time setup</p>
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
        )}

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
