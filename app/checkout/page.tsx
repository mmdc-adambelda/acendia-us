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

// PayPal and Wise removed from the checkout UI for now, per owner
// request — Stripe only. The underlying integrations (lib/payments/
// paypal.ts, lib/payments/wise.ts) and /api/checkout/create's handling
// for those providers are untouched, so re-adding them later is just
// adding their entries back here.
const PROVIDER_META: Partial<Record<PaymentProvider, { label: string; description: string }>> = {
  stripe: { label: "Card (Stripe)", description: "Instant activation. Visa, Mastercard, Amex, and more." },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { user, profile } = await requireAuth();
  const { error: errorMessage } = await searchParams;

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

  // Only ever lists providers actually present in PROVIDER_META above
  // (Stripe only, for now) AND actually configured — never offers a
  // payment method that would just fail.
  const availableProviders = (Object.keys(PROVIDER_META) as PaymentProvider[])
    .filter((p) => isProviderConfigured(p))
    .map((provider) => ({ provider, ...PROVIDER_META[provider]! }));

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
            <CheckoutClient
              availableProviders={availableProviders}
              planSummary={planSummary}
              errorMessage={errorMessage ?? null}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
