import type { Metadata } from "next";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import ConfirmWisePaymentButton from "@/components/admin/ConfirmWisePaymentButton";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Payments",
  description: "Manage Acendia payments.",
  path: "/admin/payments/",
  noIndex: true,
});

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function AdminPaymentsPage() {
  await getAdminContext();
  const supabase = await createClient();

  const [{ data: pendingWise }, { data: recent }] = await Promise.all([
    supabase
      .from("payments")
      .select("id, organization_id, amount_cents, wise_reference, description, created_at")
      .eq("payment_provider", "wise")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("payments")
      .select("id, organization_id, payment_provider, status, amount_cents, description, paid_at, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const orgIds = [...new Set([...(pendingWise ?? []), ...(recent ?? [])].map((p) => p.organization_id))];
  const { data: orgs } = orgIds.length
    ? await supabase.from("organizations").select("id, name").in("id", orgIds)
    : { data: [] as { id: string; name: string }[] };
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Payments</h1>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Wise Transfers Awaiting Confirmation</h2>
        <div className="mt-3 space-y-2">
          {(!pendingWise || pendingWise.length === 0) && (
            <Card>
              <p className="text-sm text-white/60">Nothing pending — all Wise transfers are reconciled.</p>
            </Card>
          )}
          {pendingWise?.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3 border-amber-400/30 bg-amber-400/5 p-4">
              <div>
                <p className="text-sm font-medium text-white">{orgNameById.get(p.organization_id) ?? "Unknown business"}</p>
                <p className="mt-0.5 text-xs text-white/50">
                  {formatCents(p.amount_cents)} · Ref: <span className="font-mono">{p.wise_reference}</span> ·{" "}
                  {new Date(p.created_at).toLocaleDateString("en-US")}
                </p>
              </div>
              <ConfirmWisePaymentButton paymentId={p.id} />
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-white/50">Recent Payments</h2>
        <div className="mt-3 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-2 font-medium">Business</th>
                <th className="px-4 py-2 font-medium">Method</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                    No payments yet.
                  </td>
                </tr>
              )}
              {recent?.map((p) => (
                <tr key={p.id} className="border-t border-[var(--border-dim)]">
                  <td className="px-4 py-2 text-white">{orgNameById.get(p.organization_id) ?? "—"}</td>
                  <td className="px-4 py-2 text-white/60 capitalize">{p.payment_provider}</td>
                  <td className="px-4 py-2 text-white">{formatCents(p.amount_cents)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-2 text-white/50">{new Date(p.paid_at ?? p.created_at).toLocaleDateString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
