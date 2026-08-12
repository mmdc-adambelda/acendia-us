import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your Acendia subscription.",
  path: "/checkout/",
  noIndex: true,
});

// Real checkout (Stripe Checkout / PayPal Subscriptions / Wise payment
// link) ships in Phase 2, once real (even sandbox) provider credentials
// exist — see CLIENT-PORTAL-IMPLEMENTATION.md §5. This stub keeps the
// discover -> register -> checkout -> onboarding -> portal flow intact and
// auth-gated in the meantime, rather than dead-ending or 404ing.
export default async function CheckoutPage() {
  await requireAuth();

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <Card>
          <h1 className="text-2xl font-semibold text-white">Checkout is almost ready</h1>
          <p className="mt-3 text-sm text-white/60">
            Your account and business profile are saved. Online payment (card, PayPal, or Wise) is being connected
            now — our team will follow up directly to activate your plan in the meantime.
          </p>
          <Link
            href="/contact/"
            className="focus-ring mt-6 inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Contact Our Team
          </Link>
        </Card>
      </Container>
    </div>
  );
}
