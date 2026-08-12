import type { Metadata } from "next";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout Cancelled",
  description: "Your checkout was cancelled.",
  path: "/checkout/cancel/",
  noIndex: true,
});

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg text-center">
        <Card>
          <h1 className="text-2xl font-semibold text-white">Checkout cancelled</h1>
          <p className="mt-3 text-sm text-white/60">
            No payment was made. Your account and business details are still saved — you can pick up where you left
            off whenever you're ready.
          </p>
          <Button href="/pricing/" className="mt-6">
            Back to Pricing
          </Button>
        </Card>
      </Container>
    </div>
  );
}
