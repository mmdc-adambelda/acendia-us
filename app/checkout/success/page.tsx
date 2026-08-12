import type { Metadata } from "next";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = buildMetadata({
  title: "Payment Confirmed",
  description: "Your Acendia subscription is being activated.",
  path: "/checkout/success/",
  noIndex: true,
});

// IMPORTANT: this page is never the source of truth that a payment
// succeeded. Subscription activation happens only from a verified
// server-side webhook event (Phase 2) — this page just tells the client
// what to expect while that confirmation lands, per
// CLIENT-PORTAL-IMPLEMENTATION.md's explicit "never trust the success URL
// alone" requirement.
export default async function CheckoutSuccessPage() {
  await requireAuth();

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <Card>
          <h1 className="text-2xl font-semibold text-white">Thanks — we're confirming your payment</h1>
          <p className="mt-3 text-sm text-white/60">
            Your subscription activates automatically once your payment provider confirms the charge, usually within
            a few moments. You'll get a confirmation email and see your plan reflected in the portal shortly.
          </p>
          <Button href="/onboarding/" className="mt-6">
            Continue to Onboarding
          </Button>
        </Card>
      </Container>
    </div>
  );
}
