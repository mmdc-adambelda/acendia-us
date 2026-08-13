import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProviderConfigured, type PaymentProvider } from "@/lib/payments/types";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your Acendia subscription.",
  path: "/checkout/",
  noIndex: true,
});

const PROVIDER_META: Record<PaymentProvider, { label: string; description: string }> = {
  stripe: { label: "Card (Stripe)", description: "Instant activation. Visa, Mastercard, Amex, and more." },
  paypal: { label: "PayPal", description: "Pay with your PayPal balance, bank, or card via PayPal." },
  wise: {
    label: "Wise Transfer",
    description: "Manual bank transfer. Activation confirmed by our team, typically within 1 business day.",
  },
};

export default async function CheckoutPage() {
  const { user, profile } = await requireAuth();

  let planSummary: { name: string; setupFeeCents: number; monthlyPriceCents: number }[] = [];
  let hasPlanSelection = false;

  try {
    const admin = createAdminClient();
    const { data: membership } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership) {
      const { data: goalsLog } = await admin
        .from("activity_logs")
        .select("metadata")
        .eq("organization_id", membership.organization_id)
        .eq("action", "registration_goals_captured")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const metadata = goalsLog?.metadata as Record<string, unknown> | undefined;
      const requestedPlanId = metadata?.requestedPlanId as string | undefined;
      const addonPlanIds = (metadata?.addonPlanIds as string[] | undefined) ?? [];

      if (requestedPlanId) {
        const { data: plans } = await admin
          .from("plans")
          .select("name, setup_fee_cents, monthly_price_cents")
          .in("id", [requestedPlanId, ...addonPlanIds]);
        if (plans && plans.length > 0) {
          hasPlanSelection = true;
          planSummary = plans.map((p) => ({
            name: p.name,
            setupFeeCents: p.setup_fee_cents ?? 0,
            monthlyPriceCents: p.monthly_price_cents ?? 0,
          }));
        }
      }
    }
  } catch (err) {
    console.error("Checkout page: failed to load plan summary", err);
  }

  // SHOW_ALL_PAYMENT_METHODS: temporary display override so Stripe/PayPal/
  // Wise all appear as selectable options before any of them are actually
  // wired up (owner is demoing to a client and needs the real intended
  // options visible today). This never fakes a successful payment — if
  // someone actually submits an unconfigured provider, /api/checkout/create
  // still checks isProviderConfigured()/isWiseAvailable() server-side and
  // returns an honest "isn't configured yet, please contact us" error
  // instead of processing anything. Remove this override (revert to
  // filtering by isProviderConfigured()) once all three are genuinely
  // connected, so real customers only ever see options that actually work.
  const SHOW_ALL_PAYMENT_METHODS = true;
  const availableProviders = (Object.keys(PROVIDER_META) as PaymentProvider[])
    .filter((p) => SHOW_ALL_PAYMENT_METHODS || isProviderConfigured(p))
    .map((provider) => ({ provider, ...PROVIDER_META[provider] }));

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg">
        <h1 className="text-center text-2xl font-semibold text-white">
          {profile?.first_name ? `Almost there, ${profile.first_name}` : "Almost there"}
        </h1>
        {!hasPlanSelection ? (
          <Card className="mt-6 text-center">
            <p className="text-sm text-white/60">
              We couldn't find a plan selection on your account yet. Please contact us and we'll get your checkout
              sorted directly.
            </p>
            <Link
              href="/contact/"
              className="focus-ring mt-6 inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
            >
              Contact Our Team
            </Link>
          </Card>
        ) : (
          <div className="mt-6">
            <CheckoutClient availableProviders={availableProviders} planSummary={planSummary} />
          </div>
        )}
      </Container>
    </div>
  );
}
