import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Messages",
  description: "Client conversations.",
  path: "/admin/messages/",
  noIndex: true,
});

export default async function AdminMessagesPage() {
  await getAdminContext();
  const supabase = await createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, organization_id, subject, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  const orgIds = [...new Set((conversations ?? []).map((c) => c.organization_id))];
  const { data: orgs } = orgIds.length ? await supabase.from("organizations").select("id, name").in("id", orgIds) : { data: [] };
  const orgNameById = new Map((orgs ?? []).map((o) => [o.id, o.name]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Messages</h1>

      <div className="mt-6 space-y-2">
        {(!conversations || conversations.length === 0) && (
          <Card>
            <p className="text-sm text-white/60">No conversations yet.</p>
          </Card>
        )}
        {conversations?.map((c) => (
          <Card key={c.id} href={`/admin/messages/${c.id}/`} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-white">{orgNameById.get(c.organization_id) ?? "—"}</p>
              <p className="text-xs text-white/40">{c.subject ?? "General"}</p>
            </div>
            <span className="text-xs text-white/40">{new Date(c.updated_at).toLocaleDateString("en-US")}</span>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/30">
        <Link href="/portal/messages/" className="hover:underline">
          Note: clients start conversations from their portal — nothing to create here.
        </Link>
      </p>
    </div>
  );
}
