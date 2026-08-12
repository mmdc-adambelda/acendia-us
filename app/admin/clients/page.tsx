import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Clients",
  description: "Manage Acendia clients.",
  path: "/admin/clients/",
  noIndex: true,
});

export default async function AdminClientsPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, city, state, onboarding_status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const orgIds = (orgs ?? []).map((o) => o.id);
  const { data: subs } = orgIds.length
    ? await supabase.from("subscriptions").select("organization_id, status").in("organization_id", orgIds)
    : { data: [] as { organization_id: string; status: string }[] };

  const statusByOrg = new Map<string, string>();
  (subs ?? []).forEach((s) => {
    // Keep the most recently seen status per org (subs rows aren't ordered
    // here, but a single-status summary is good enough for a list view).
    statusByOrg.set(s.organization_id, s.status);
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
        <Link
          href="/admin/clients/new/"
          className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
        >
          + New Client
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[var(--r-lg)] border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-2 font-medium">Business</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium">Onboarding</th>
              <th className="px-4 py-2 font-medium">Subscription</th>
              <th className="px-4 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(!orgs || orgs.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                  No clients yet.
                </td>
              </tr>
            )}
            {orgs?.map((o) => (
              <tr key={o.id} className="border-t border-[var(--border-dim)] hover:bg-white/[0.02]">
                <td className="px-4 py-2">
                  <Link href={`/admin/clients/${o.id}/`} className="focus-ring font-medium text-white hover:underline">
                    {o.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-white/60">{[o.city, o.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={o.onboarding_status} />
                </td>
                <td className="px-4 py-2">
                  {statusByOrg.has(o.id) ? <StatusBadge status={statusByOrg.get(o.id)!} /> : <span className="text-white/30">No subscription</span>}
                </td>
                <td className="px-4 py-2 text-white/50">{new Date(o.created_at).toLocaleDateString("en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
