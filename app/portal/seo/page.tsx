import type { Metadata } from "next";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "SEO Performance",
  description: "Your Acendia SEO performance metrics.",
  path: "/portal/seo/",
  noIndex: true,
});

export default async function SeoPerformancePage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let keywords: { id: string; keyword: string; position: number | null; previous_position: number | null; recorded_at: string }[] = [];
  let traffic: { id: string; period_start: string; period_end: string; organic_sessions: number | null; clicks: number | null; impressions: number | null }[] = [];
  let leads: { id: string; period_start: string; period_end: string; leads_count: number | null; source: string | null }[] = [];

  if (project) {
    const [{ data: k }, { data: t }, { data: l }] = await Promise.all([
      supabase
        .from("keyword_metrics")
        .select("id, keyword, position, previous_position, recorded_at")
        .eq("project_id", project.id)
        .order("recorded_at", { ascending: false })
        .limit(25),
      supabase
        .from("traffic_metrics")
        .select("id, period_start, period_end, organic_sessions, clicks, impressions")
        .eq("project_id", project.id)
        .order("period_start", { ascending: false })
        .limit(6),
      supabase
        .from("lead_metrics")
        .select("id, period_start, period_end, leads_count, source")
        .eq("project_id", project.id)
        .order("period_start", { ascending: false })
        .limit(6),
    ]);
    keywords = k ?? [];
    traffic = t ?? [];
    leads = l ?? [];
  }

  const hasAnyData = keywords.length > 0 || traffic.length > 0 || leads.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">SEO Performance</h1>

      {!hasAnyData ? (
        <Card className="mt-6">
          <p className="text-sm text-white/60">
            Performance data hasn&apos;t started tracking yet. Once your campaign is underway, keyword rankings,
            organic traffic, and lead metrics will appear here — never estimated or fabricated, only what we
            actually measure.
          </p>
        </Card>
      ) : (
        <div className="mt-6 space-y-8">
          {traffic.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-white/50">Organic Traffic</h2>
              <div className="mt-3 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/50">
                    <tr>
                      <th className="px-4 py-2 font-medium">Period</th>
                      <th className="px-4 py-2 font-medium">Sessions</th>
                      <th className="px-4 py-2 font-medium">Clicks</th>
                      <th className="px-4 py-2 font-medium">Impressions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traffic.map((row) => (
                      <tr key={row.id} className="border-t border-[var(--border-dim)]">
                        <td className="px-4 py-2 text-white/70">
                          {new Date(row.period_start).toLocaleDateString("en-US")} –{" "}
                          {new Date(row.period_end).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-4 py-2 text-white">{row.organic_sessions ?? "—"}</td>
                        <td className="px-4 py-2 text-white">{row.clicks ?? "—"}</td>
                        <td className="px-4 py-2 text-white">{row.impressions ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {keywords.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-white/50">Keyword Rankings</h2>
              <div className="mt-3 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/50">
                    <tr>
                      <th className="px-4 py-2 font-medium">Keyword</th>
                      <th className="px-4 py-2 font-medium">Position</th>
                      <th className="px-4 py-2 font-medium">Previous</th>
                      <th className="px-4 py-2 font-medium">Recorded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((row) => (
                      <tr key={row.id} className="border-t border-[var(--border-dim)]">
                        <td className="px-4 py-2 text-white">{row.keyword}</td>
                        <td className="px-4 py-2 text-white">{row.position ?? "—"}</td>
                        <td className="px-4 py-2 text-white/60">{row.previous_position ?? "—"}</td>
                        <td className="px-4 py-2 text-white/60">{new Date(row.recorded_at).toLocaleDateString("en-US")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {leads.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-white/50">Leads</h2>
              <div className="mt-3 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/[0.03] text-white/50">
                    <tr>
                      <th className="px-4 py-2 font-medium">Period</th>
                      <th className="px-4 py-2 font-medium">Leads</th>
                      <th className="px-4 py-2 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((row) => (
                      <tr key={row.id} className="border-t border-[var(--border-dim)]">
                        <td className="px-4 py-2 text-white/70">
                          {new Date(row.period_start).toLocaleDateString("en-US")} –{" "}
                          {new Date(row.period_end).toLocaleDateString("en-US")}
                        </td>
                        <td className="px-4 py-2 text-white">{row.leads_count ?? "—"}</td>
                        <td className="px-4 py-2 text-white/60">{row.source ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
