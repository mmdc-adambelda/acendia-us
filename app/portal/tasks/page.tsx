import type { Metadata } from "next";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Tasks",
  description: "Your Acendia campaign tasks.",
  path: "/portal/tasks/",
  noIndex: true,
});

export default async function TasksPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let tasks: { id: string; title: string; description: string | null; status: string; due_date: string | null }[] = [];
  if (project) {
    const { data } = await supabase
      .from("tasks")
      .select("id, title, description, status, due_date")
      .eq("project_id", project.id)
      .eq("client_visible", true) // internal_notes and staff-only tasks are never selected here
      .order("due_date", { ascending: true, nullsFirst: false });
    tasks = data ?? [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Tasks</h1>
      <p className="mt-1 text-sm text-white/50">Work items your account team is tracking for your campaign.</p>

      <div className="mt-6 space-y-2">
        {tasks.length === 0 && (
          <Card>
            <p className="text-sm text-white/60">No tasks yet — check back once your campaign is underway.</p>
          </Card>
        )}
        {tasks.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-white">{t.title}</span>
              <StatusBadge status={t.status} />
            </div>
            {t.description && <p className="mt-1 text-sm text-white/50">{t.description}</p>}
            {t.due_date && (
              <p className="mt-2 text-xs text-white/40">Due {new Date(t.due_date).toLocaleDateString("en-US")}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
