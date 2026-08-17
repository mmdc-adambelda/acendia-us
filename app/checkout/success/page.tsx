import type { Metadata } from "next";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = buildMetadata({
  title: "Payment Confirmed",
  description: "Your Acendia subscription is being activated.",
  path: "/checkout/success/",
  noIndex: true,
});

// IMPORTANT: this page is never the source of truth that a payment
// succeeded — it's reachable by anyone who lands on this URL, redirect or
// not. It reads the REAL subscription status from the database (which only
// a verified webhook, or admin confirmation for Wise, ever changes) and
// reflects that back, per CLIENT-PORTAL-IMPLEMENTATION.md's explicit "never
// trust the success URL alone" requirement.
export default async function CheckoutSuccessPage() {
  const { user } = await requireAuth();

  let status: string | null = null;
  try {
    const admin = createAdminClient();
    const { data: membership } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (membership) {
      const { data: sub } = await admin
        .from("subscriptions")
        .select("status")
        .eq("organization_id", membership.organization_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      status = sub?.status ?? null;
    }
  } catch (err) {
    console.error("Checkout success page: failed to load subscription status", err);
  }

  const isActive = status === "active" || status === "trialing";

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <Card>
          {isActive ? (
            <>
              <h1 className="text-2xl font-semibold text-white">You're all set 🎉</h1>
              <p className="mt-3 text-sm text-white/60">
                Your subscription is active. Let's finish onboarding so we can get your campaign started.
              </p>
            </>
          ) : status === "pending" ? (
            <>
              <h1 className="text-2xl font-semibold text-white">We're confirming your payment</h1>
              <p className="mt-3 text-sm text-white/60">
                Your subscription activates automatically once your payment provider confirms the charge — usually
                within a few moments for card/PayPal, or within a business day for Wise transfers. You'll get a
                confirmation email and see your plan reflected here shortly.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white">Thanks — we're confirming your payment</h1>
              <p className="mt-3 text-sm text-white/60">
                Your subscription activates automatically once your payment provider confirms the charge. You'll get
                a confirmation email and see your plan reflected in the portal shortly.
              </p>
            </>
          )}
          {/* Deliberately signs out and sends the person to a fresh login
              instead of continuing the registration session straight into
              onboarding — a clean re-auth boundary between "just paid" and
              "doing onboarding" rather than relying on one long-lived
              session surviving the whole signup→checkout→onboarding
              chain. /logout/'s ?next= carries the destination through to
              /login/'s own ?next=, so logging back in lands directly on
              /onboarding/. */}
          <Button href="/logout/?next=/onboarding/" className="mt-6">
            Log In to Continue Onboarding
          </Button>
        </Card>
      </Container>
    </div>
  );
}
