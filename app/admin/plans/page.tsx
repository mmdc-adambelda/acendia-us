import type { Metadata } from "next";
import Card from "@/components/Card";
import PlanActiveToggle from "@/components/admin/PlanActiveToggle";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext, ADMIN_ROLES } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Plans",
  description: "Manage Acendia pricing plans.",
  path: "/admin/plans/",
  noIndex: true,
});

function formatCents(cents: number | null): string {
  if (!cents) return "—";
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default async function AdminPlansPage() {
  const ctx = await getAdminContext();
  const isAdmin = (ADMIN_ROLES as readonly string[]).includes(ctx.profile?.role ?? "");
  const supabase = await createClient();

  const { data: plans } = await supabase.from("plans").select("*").order("display_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Plans</h1>
      <p className="mt-1 text-sm text-white/50">
        Price, feature, and slug changes are made directly in Supabase&apos;s Table Editor on{" "}
        <code className="text-white/70">plans</code> — prices are never editable through this app&apos;s UI, by
        design, so checkout can never be tricked into a wrong amount. Stripe/PayPal provider IDs are set via{" "}
        <code className="text-white/70">supabase/migrations/0005_payment_provider_ids_template.sql</code>.
        {!isAdmin && " Activating/deactivating a plan requires an admin or super_admin role."}
      </p>

      <div className="mt-6 space-y-3">
        {(plans ?? []).map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">
                  {p.name} <span className="text-white/40">({p.plan_type})</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Setup {formatCents(p.setup_fee_cents)} · Monthly {formatCents(p.monthly_price_cents)}
                </p>
                <p className="mt-1 text-xs text-white/30">
                  Stripe: {p.stripe_price_id_monthly ?? "not set"} · PayPal: {p.paypal_plan_id_monthly ?? "not set"} · Wise:{" "}
                  {p.wise_available ? "available" : "unavailable"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${p.is_active ? "text-emerald-300" : "text-white/40"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
                {isAdmin && <PlanActiveToggle planId={p.id} isActive={p.is_active} />}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
