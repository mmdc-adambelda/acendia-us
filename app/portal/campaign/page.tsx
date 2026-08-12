import type { Metadata } from "next";
import Card from "@/components/Card";
import StatusBadge, { labelize } from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Campaign",
  description: "Your Acendia campaign overview.",
  path: "/portal/campaign/",
  noIndex: true,
});

const STAGES = ["audit_benchmark", "strategy", "implementation", "optimization", "reporting", "scaling"];

export default async function CampaignPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, primary_objective, target_keywords, target_cities, target_states, stage, health, started_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let services: { id: string; service_name: string; is_active: boolean }[] = [];
  let milestones: { id: string; name: string; expected_date: string | null; completed_at: string | null }[] = [];
  if (project) {
    const [{ data: s }, { data: m }] = await Promise.all([
      supabase.from("campaign_services").select("id, service_name, is_active").eq("project_id", project.id),
      supabase
        .from("milestones")
        .select("id, name, expected_date, completed_at")
        .eq("project_id", project.id)
        .order("expected_date", { ascending: true }),
    ]);
    services = s ?? [];
    milestones = m ?? [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Campaign</h1>

      {!project ? (
        <Card className="mt-6">
          <p className="text-sm text-white/60">
            Your campaign hasn&apos;t been set up yet. Once your subscription is active and onboarding is complete,
            your account team will build out your campaign plan here.
          </p>
        </Card>
      ) : (
        <>
          <Card className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{project.name}</h2>
              <StatusBadge status={project.health} />
            </div>
            {project.primary_objective && <p className="mt-2 text-sm text-white/60">{project.primary_objective}</p>}
          </Card>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-white/50">Campaign Stage</h3>
            <ol className="mt-3 flex flex-wrap gap-2">
              {STAGES.map((stage) => {
                const isCurrent = stage === project.stage;
                const isPast = STAGES.indexOf(stage) < STAGES.indexOf(project.stage);
                return (
                  <li
                    key={stage}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      isCurrent
                        ? "border-white bg-white text-black"
                        : isPast
                          ? "border-white/30 bg-white/10 text-white/70"
                          : "border-white/10 text-white/40"
                    }`}
                  >
                    {labelize(stage)}
                  </li>
                );
              })}
            </ol>
          </div>

          {services.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-white/50">Active Services</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {services.map((s) => (
                  <Card key={s.id} className="p-4 text-sm text-white">
                    {s.service_name}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {(project.target_keywords?.length || project.target_cities?.length) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {project.target_keywords && project.target_keywords.length > 0 && (
                <Card>
                  <h3 className="text-sm font-medium text-white/50">Target Keywords</h3>
                  <p className="mt-2 text-sm text-white">{project.target_keywords.join(", ")}</p>
                </Card>
              )}
              {project.target_cities && project.target_cities.length > 0 && (
                <Card>
                  <h3 className="text-sm font-medium text-white/50">Target Locations</h3>
                  <p className="mt-2 text-sm text-white">
                    {[...(project.target_cities ?? []), ...(project.target_states ?? [])].join(", ")}
                  </p>
                </Card>
              )}
            </div>
          )}

          {milestones.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-white/50">Milestones</h3>
              <div className="mt-3 space-y-2">
                {milestones.map((m) => (
                  <Card key={m.id} className="flex items-center justify-between p-4">
                    <span className="text-sm text-white">{m.name}</span>
                    <span className="text-xs text-white/50">
                      {m.completed_at
                        ? `Completed ${new Date(m.completed_at).toLocaleDateString("en-US")}`
                        : m.expected_date
                          ? `Expected ${new Date(m.expected_date).toLocaleDateString("en-US")}`
                          : "—"}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
