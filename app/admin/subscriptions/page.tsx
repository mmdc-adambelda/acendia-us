import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/portal/StatusBadge";
import SubscriptionStatusSelect from "@/components/admin/SubscriptionStatusSelect";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Subscriptions",
  description: "Manage Acendia client subscriptions.",
  path: "/admin/subscriptions/",
  noIndex: true,
});

export default async function AdminSubscriptionsPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: subs } = await supabase
    .from("subscriptions")
    .select("id, organization_id, plan_id, status, payment_provider, billing_cycle, current_period_end, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const orgIds = [...new Set((subs ?? []).map((s) => s.organization_id))];
  const planIds = [...new Set((subs ?? []).map((s) => s.plan_id))];
  const [{ data: orgs }, { data: plans }] = await Promise.all([
    orgIds.length ? supabase.from("organizations").select("id, name").in("id", orgIds) : Promise.resolve({ data: [] }),
    planIds.length ? supabase.from("plans").select("id, name").in("id", planIds) : Promise.resolve({ data: [] }),
  ]);
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));
  const planNameById = new Map((plans ?? []).map((p) => [p.id, p.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Subscriptions</h1>
      <p className="mt-1 text-sm text-white/50">
        Status changes here are logged to the activity log. Real automatic changes still come from provider webhooks
        — use this for manual overrides and corrections.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-2 font-medium">Business</th>
              <th className="px-4 py-2 font-medium">Plan</th>
              <th className="px-4 py-2 font-medium">Provider</th>
              <th className="px-4 py-2 font-medium">Renews</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(!subs || subs.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                  No subscriptions yet.
                </td>
              </tr>
            )}
            {subs?.map((s) => (
              <tr key={s.id} className="border-t border-[var(--border-dim)]">
                <td className="px-4 py-2">
                  <Link href={`/admin/clients/${s.organization_id}/`} className="focus-ring font-medium text-white hover:underline">
                    {orgNameById.get(s.organization_id) ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-2 text-white/70">{planNameById.get(s.plan_id) ?? "—"}</td>
                <td className="px-4 py-2 text-white/60 capitalize">{s.payment_provider ?? "—"}</td>
                <td className="px-4 py-2 text-white/50">
                  {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("en-US") : "—"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={s.status} />
                    <SubscriptionStatusSelect subscriptionId={s.id} status={s.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
