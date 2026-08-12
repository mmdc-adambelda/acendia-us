import type { Metadata } from "next";
import Link from "next/link";
import { labelize } from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Activity Log",
  description: "Acendia system activity log.",
  path: "/admin/activity/",
  noIndex: true,
});

export default async function AdminActivityPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("activity_logs")
    .select("id, organization_id, actor_id, action, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const orgIds = [...new Set((logs ?? []).map((l) => l.organization_id).filter((id): id is string => Boolean(id)))];
  const { data: orgs } = orgIds.length ? await supabase.from("organizations").select("id, name").in("id", orgIds) : { data: [] };
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Activity Log</h1>
      <p className="mt-1 text-sm text-white/50">Full audit trail — every subscription, payment, and account change.</p>

      <div className="mt-6 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-2 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Business</th>
              <th className="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-white/40">
                  No activity yet.
                </td>
              </tr>
            )}
            {logs?.map((l) => (
              <tr key={l.id} className="border-t border-[var(--border-dim)] align-top">
                <td className="whitespace-nowrap px-4 py-2 text-white/50">
                  {new Date(l.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td className="px-4 py-2 text-white">
                  {l.organization_id ? (
                    <Link href={`/admin/clients/${l.organization_id}/`} className="hover:underline">
                      {orgNameById.get(l.organization_id) ?? "—"}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2 text-white/70">{labelize(l.action)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
