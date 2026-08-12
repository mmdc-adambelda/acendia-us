import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge, { labelize } from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description: "Manage Acendia client campaigns.",
  path: "/admin/projects/",
  noIndex: true,
});

export default async function AdminProjectsPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, organization_id, name, stage, health, started_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const orgIds = [...new Set((projects ?? []).map((p) => p.organization_id))];
  const { data: orgs } = orgIds.length ? await supabase.from("organizations").select("id, name").in("id", orgIds) : { data: [] };
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Projects</h1>
      <p className="mt-1 text-sm text-white/50">
        Created and managed from the database today — a dedicated project-creation form is a good next iteration.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-2 font-medium">Business</th>
              <th className="px-4 py-2 font-medium">Campaign</th>
              <th className="px-4 py-2 font-medium">Stage</th>
              <th className="px-4 py-2 font-medium">Health</th>
            </tr>
          </thead>
          <tbody>
            {(!projects || projects.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-white/40">
                  No campaigns yet.
                </td>
              </tr>
            )}
            {projects?.map((p) => (
              <tr key={p.id} className="border-t border-[var(--border-dim)]">
                <td className="px-4 py-2">
                  <Link href={`/admin/clients/${p.organization_id}/`} className="focus-ring font-medium text-white hover:underline">
                    {orgNameById.get(p.organization_id) ?? "—"}
                  </Link>
                </td>
                <td className="px-4 py-2 text-white/70">{p.name}</td>
                <td className="px-4 py-2 text-white/60">{labelize(p.stage)}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={p.health} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
