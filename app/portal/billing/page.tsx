import type { Metadata } from "next";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import ManageBillingButton from "@/components/portal/ManageBillingButton";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Billing",
  description: "Your Acendia subscription and payment history.",
  path: "/portal/billing/",
  noIndex: true,
});

function formatCents(cents: number | null): string {
  if (cents === null) return "—";
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function BillingPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  let planName: string | null = null;
  if (ctx.subscription?.plan_id) {
    const { data: plan } = await supabase.from("plans").select("name").eq("id", ctx.subscription.plan_id).maybeSingle();
    planName = plan?.name ?? null;
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("id, payment_provider, status, amount_cents, description, paid_at, created_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Billing</h1>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{planName ?? "No active plan"}</h2>
            {ctx.subscription?.current_period_end && (
              <p className="mt-1 text-sm text-white/50">
                {ctx.subscription.cancel_at_period_end ? "Cancels" : "Renews"}{" "}
                {new Date(ctx.subscription.current_period_end).toLocaleDateString("en-US")}
              </p>
            )}
          </div>
          {ctx.subscription && <StatusBadge status={ctx.subscription.status} />}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {ctx.subscription?.payment_provider === "stripe" && <ManageBillingButton />}
          {ctx.subscription?.payment_provider === "wise" && (
            <p className="text-sm text-white/50">
              Your plan is billed via manual Wise transfer. Contact your account team to arrange your next payment.
            </p>
          )}
          {(!ctx.subscription || ctx.subscription.status === "pending") && (
            <a
              href="/checkout/"
              className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
            >
              Complete Checkout
            </a>
          )}
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-white/50">Payment History</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(!payments || payments.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                    No payments yet.
                  </td>
                </tr>
              )}
              {payments?.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border-dim)]">
                  <td className="px-4 py-2 text-white/70">
                    {new Date(p.paid_at ?? p.created_at).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-2 text-white">{p.description ?? "—"}</td>
                  <td className="px-4 py-2 text-white/60 capitalize">{p.payment_provider}</td>
                  <td className="px-4 py-2 text-white">{formatCents(p.amount_cents)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
