import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWisePaymentLink } from "@/lib/payments/wise";

export const metadata: Metadata = buildMetadata({
  title: "Complete Your Wise Payment",
  description: "Complete your Acendia setup fee via Wise transfer.",
  path: "/checkout/wise/",
  noIndex: true,
});

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/**
 * Reached only via a server-side redirect from /api/checkout/create — that
 * route already wrote the pending payment + reference to the database
 * before sending someone here, so this page just reads it back rather
 * than receiving it via the URL (keeps the reference out of browser
 * history/referrer headers, and survives a refresh).
 */
export default async function CheckoutWisePage() {
  const { user } = await requireAuth();
  const admin = createAdminClient();

  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect("/checkout/");

  const { data: payment } = await admin
    .from("payments")
    .select("wise_reference, amount_cents")
    .eq("organization_id", membership.organization_id)
    .eq("payment_provider", "wise")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!payment?.wise_reference) redirect("/checkout/");

  const paymentLink = getWisePaymentLink();

  return (
    <div className="flex min-h-screen items-center justify-center py-20">
      <Container className="max-w-lg">
        <Card>
          <h1 className="text-lg font-semibold text-white">Complete your setup payment via Wise</h1>
          <p className="mt-2 text-sm text-white/60">
            This is your one-time setup fee only — confirmed manually by our team once the transfer arrives, usually
            within one business day. Your monthly plan is a separate Wise invoice we&apos;ll send 14 days after your
            site goes live; nothing else is due today.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--border-dim)] pb-2">
              <dt className="text-white/50">Setup fee due today</dt>
              <dd className="font-medium text-white">{formatCents(payment.amount_cents)}</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--border-dim)] pb-2">
              <dt className="text-white/50">Payment reference (required)</dt>
              <dd className="font-mono font-medium text-white">{payment.wise_reference}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-white/60">
            Include the reference above in your Wise transfer notes so we can match your payment.
          </p>
          {paymentLink ? (
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-6 inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
            >
              Open Wise Payment Link
            </a>
          ) : (
            <p className="mt-4 rounded-[var(--r-sm)] border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
              Our team will reach out with Wise transfer details shortly. Reference the code above in your transfer.
            </p>
          )}
          <a
            href="/checkout/success/"
            className="focus-ring mt-4 block text-sm text-white/50 underline hover:text-white"
          >
            I&apos;ve sent the transfer — continue
          </a>
        </Card>
      </Container>
    </div>
  );
}
