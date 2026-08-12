import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import TaskStatusSelect from "@/components/admin/TaskStatusSelect";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Tasks",
  description: "Manage Acendia campaign tasks.",
  path: "/admin/tasks/",
  noIndex: true,
});

export default async function AdminTasksPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, project_id, title, status, client_visible, due_date")
    .order("updated_at", { ascending: false })
    .limit(100);

  const projectIds = [...new Set((tasks ?? []).map((t) => t.project_id))];
  const { data: projects } = projectIds.length
    ? await supabase.from("projects").select("id, name, organization_id").in("id", projectIds)
    : { data: [] };
  const projectById = new Map((projects ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Tasks</h1>
      <p className="mt-1 text-sm text-white/50">
        Toggle <code className="text-white/70">client_visible</code> per task directly in Supabase if a task should
        stay internal-only.
      </p>

      <div className="mt-6 space-y-2">
        {(!tasks || tasks.length === 0) && (
          <Card>
            <p className="text-sm text-white/60">No tasks yet.</p>
          </Card>
        )}
        {tasks?.map((t) => {
          const project = projectById.get(t.project_id);
          return (
            <Card key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm text-white">{t.title}</p>
                <p className="mt-0.5 text-xs text-white/40">
                  {project && (
                    <Link href={`/admin/clients/${project.organization_id}/`} className="hover:underline">
                      {project.name}
                    </Link>
                  )}
                  {t.due_date && ` · Due ${new Date(t.due_date).toLocaleDateString("en-US")}`}
                  {!t.client_visible && " · internal only"}
                </p>
              </div>
              <TaskStatusSelect taskId={t.id} status={t.status} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
