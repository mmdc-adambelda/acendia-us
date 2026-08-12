import type { Metadata } from "next";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Reports",
  description: "Your Acendia monthly reports.",
  path: "/portal/reports/",
  noIndex: true,
});

export default async function ReportsPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, month, executive_summary, work_completed, recommendations, next_priorities, pdf_url, published_at")
    .eq("organization_id", ctx.organizationId)
    .not("published_at", "is", null)
    .order("month", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Reports</h1>
      <p className="mt-1 text-sm text-white/50">Monthly performance summaries from your account team.</p>

      <div className="mt-6 space-y-4">
        {(!reports || reports.length === 0) && (
          <Card>
            <p className="text-sm text-white/60">
              No reports have been published yet. Your first monthly report will appear here once your campaign has
              a full reporting cycle behind it.
            </p>
          </Card>
        )}
        {reports?.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">
                {new Date(r.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
              {r.pdf_url && (
                <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="focus-ring text-sm text-white/60 underline hover:text-white">
                  Download PDF
                </a>
              )}
            </div>
            {r.executive_summary && <p className="mt-3 text-sm text-white/70">{r.executive_summary}</p>}
            {r.work_completed && (
              <div className="mt-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-white/40">Work Completed</h3>
                <p className="mt-1 text-sm text-white/70">{r.work_completed}</p>
              </div>
            )}
            {r.recommendations && (
              <div className="mt-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-white/40">Recommendations</h3>
                <p className="mt-1 text-sm text-white/70">{r.recommendations}</p>
              </div>
            )}
            {r.next_priorities && (
              <div className="mt-3">
                <h3 className="text-xs font-medium uppercase tracking-wide text-white/40">Next Priorities</h3>
                <p className="mt-1 text-sm text-white/70">{r.next_priorities}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
