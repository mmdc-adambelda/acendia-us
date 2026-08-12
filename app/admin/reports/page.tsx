import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import PublishReportButton from "@/components/admin/PublishReportButton";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Reports",
  description: "Manage Acendia client reports.",
  path: "/admin/reports/",
  noIndex: true,
});

export default async function AdminReportsPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, organization_id, month, published_at, created_at")
    .order("month", { ascending: false })
    .limit(100);

  const orgIds = [...new Set((reports ?? []).map((r) => r.organization_id))];
  const { data: orgs } = orgIds.length ? await supabase.from("organizations").select("id, name").in("id", orgIds) : { data: [] };
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Reports</h1>
      <p className="mt-1 text-sm text-white/50">
        Draft reports (with real metrics) via Supabase Table Editor on <code className="text-white/70">reports</code>{" "}
        + <code className="text-white/70">report_metrics</code>, then publish here when ready for the client to see.
      </p>

      <div className="mt-6 space-y-2">
        {(!reports || reports.length === 0) && (
          <Card>
            <p className="text-sm text-white/60">No reports yet.</p>
          </Card>
        )}
        {reports?.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link href={`/admin/clients/${r.organization_id}/`} className="focus-ring text-sm font-medium text-white hover:underline">
                {orgNameById.get(r.organization_id) ?? "—"}
              </Link>
              <p className="mt-0.5 text-xs text-white/40">
                {new Date(r.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <PublishReportButton reportId={r.id} published={Boolean(r.published_at)} />
          </Card>
        ))}
      </div>
    </div>
  );
}
