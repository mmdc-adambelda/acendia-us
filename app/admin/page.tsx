import type { Metadata } from "next";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { isoDaysAgo } from "@/lib/dateUtils";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Acendia internal administration.",
  path: "/admin/",
  noIndex: true,
});

function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const ctx = await getAdminContext();
  const supabase = await createClient();

  const thirtyDaysAgo = isoDaysAgo(30);

  const [
    { count: totalOrgs },
    { count: newOrgs },
    { count: activeSubs },
    { count: pastDueSubs },
    { count: pendingOnboarding },
    { count: waitingTasks },
    { count: openTickets },
    { data: activeSubRows },
  ] = await Promise.all([
    supabase.from("organizations").select("id", { count: "exact", head: true }),
    supabase.from("organizations").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
    supabase.from("organizations").select("id", { count: "exact", head: true }).neq("onboarding_status", "completed"),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "waiting_for_client"),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("subscriptions").select("plan_id, billing_cycle").eq("status", "active"),
  ]);

  // MRR: sum monthly_price_cents for every active subscription's plan.
  let mrrCents = 0;
  if (activeSubRows && activeSubRows.length > 0) {
    const planIds = [...new Set(activeSubRows.map((s) => s.plan_id))];
    const { data: plans } = await supabase.from("plans").select("id, monthly_price_cents").in("id", planIds);
    const priceById = new Map((plans ?? []).map((p) => [p.id, p.monthly_price_cents ?? 0]));
    mrrCents = activeSubRows.reduce((sum, s) => sum + (priceById.get(s.plan_id) ?? 0), 0);
  }

  const { data: pendingWisePayments } = await supabase
    .from("payments")
    .select("id")
    .eq("payment_provider", "wise")
    .eq("status", "pending");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">
        Signed in as {ctx.profile?.first_name ?? "staff"} · role: {ctx.profile?.role}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Clients" value={totalOrgs ?? 0} />
        <KpiCard label="New Clients (30d)" value={newOrgs ?? 0} />
        <KpiCard label="Active Subscriptions" value={activeSubs ?? 0} />
        <KpiCard label="Monthly Recurring Revenue" value={(mrrCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })} />
        <KpiCard label="Pending Onboarding" value={pendingOnboarding ?? 0} />
        <KpiCard label="Past Due Accounts" value={pastDueSubs ?? 0} hint={pastDueSubs ? "Needs follow-up" : undefined} />
        <KpiCard label="Tasks Waiting on Client" value={waitingTasks ?? 0} />
        <KpiCard label="Open Support Tickets" value={openTickets ?? 0} />
      </div>

      {(pendingWisePayments?.length ?? 0) > 0 && (
        <Card href="/admin/payments/" className="mt-6 border-amber-400/30 bg-amber-400/5">
          <p className="text-sm text-amber-200">
            {pendingWisePayments!.length} Wise payment{pendingWisePayments!.length === 1 ? "" : "s"} awaiting manual
            confirmation →
          </p>
        </Card>
      )}
    </div>
  );
}
