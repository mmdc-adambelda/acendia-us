import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import SubscriptionStatusSelect from "@/components/admin/SubscriptionStatusSelect";
import MarkSiteLiveForm from "@/components/admin/MarkSiteLiveForm";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Client Detail",
  description: "Acendia client detail.",
  path: "/admin/clients/",
  noIndex: true,
});

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await getAdminContext();
  const { id } = await params;
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, industry, city, state, phone, onboarding_status, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!org) notFound();

  const [{ data: members }, { data: website }, { data: subs }, { data: project }, { data: tickets }] = await Promise.all([
    supabase.from("organization_members").select("user_id, role").eq("organization_id", id),
    supabase
      .from("websites")
      .select("url, primary_service, current_seo_provider, went_live_at")
      .eq("organization_id", id)
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("id, plan_id, status, payment_provider, billing_cycle, current_period_end")
      .eq("organization_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("projects").select("id, name, stage, health").eq("organization_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("support_tickets").select("id, subject, status, created_at").eq("organization_id", id).order("created_at", { ascending: false }).limit(5),
  ]);

  const userIds = (members ?? []).map((m) => m.user_id);
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, first_name, last_name").in("id", userIds)
    : { data: [] };
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const planIds = [...new Set((subs ?? []).map((s) => s.plan_id))];
  const { data: plans } = planIds.length ? await supabase.from("plans").select("id, name").in("id", planIds) : { data: [] };
  const planNameById = new Map((plans ?? []).map((p) => [p.id, p.name]));

  let tasks: { id: string; title: string; status: string; client_visible: boolean; internal_notes: string | null }[] = [];
  if (project) {
    const { data } = await supabase
      .from("tasks")
      .select("id, title, status, client_visible, internal_notes")
      .eq("project_id", project.id)
      .order("updated_at", { ascending: false })
      .limit(10);
    tasks = data ?? [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">{org.name}</h1>
      <p className="mt-1 text-sm text-white/50">
        {[org.city, org.state].filter(Boolean).join(", ") || "No location on file"} · Joined{" "}
        {new Date(org.created_at).toLocaleDateString("en-US")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-sm font-medium text-white/50">Business</h2>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-white/40">Industry</dt><dd className="text-white">{org.industry ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-white/40">Phone</dt><dd className="text-white">{org.phone ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-white/40">Website</dt><dd className="text-white">{website?.url ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-white/40">Onboarding</dt><dd><StatusBadge status={org.onboarding_status} /></dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-white/50">Contacts</h2>
          <ul className="mt-2 space-y-1 text-sm text-white">
            {(members ?? []).map((m) => {
              const p = profileById.get(m.user_id);
              return (
                <li key={m.user_id}>
                  {p ? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Unnamed" : "Unknown"}{" "}
                  <span className="text-white/40">({m.role})</span>
                </li>
              );
            })}
            {(!members || members.length === 0) && <li className="text-white/40">No contacts</li>}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Subscriptions</h2>
        <p className="mt-1 text-xs text-white/40">
          Real billing schedule: setup fee is paid today; monthly billing starts 14 days after the site goes live.
          {website?.went_live_at
            ? ` Went live ${new Date(website.went_live_at).toLocaleDateString("en-US")}.`
            : " Go-live not recorded yet — mark it below once the site is actually live to lock in the real billing date."}
        </p>
        <div className="mt-3 space-y-2">
          {(!subs || subs.length === 0) && (
            <Card>
              <p className="text-sm text-white/60">No subscription yet.</p>
            </Card>
          )}
          {subs?.map((s) => (
            <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm text-white">{planNameById.get(s.plan_id) ?? "Plan"}</p>
                <p className="text-xs text-white/40 capitalize">
                  {s.payment_provider ?? "no provider"} · {s.billing_cycle}
                  {s.current_period_end &&
                    ` · ${s.status === "trialing" ? "billing starts" : "renews"} ${new Date(s.current_period_end).toLocaleDateString("en-US")}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={s.status} />
                <SubscriptionStatusSelect subscriptionId={s.id} status={s.status} />
              </div>
            </Card>
          ))}
        </div>
        {subs && subs.length > 0 && !website?.went_live_at && (
          <div className="mt-3">
            <MarkSiteLiveForm organizationId={org.id} />
          </div>
        )}
      </div>

      {project && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-white/50">Campaign — {project.name}</h2>
          <Card className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Stage: {project.stage.replace(/_/g, " ")}</span>
              <StatusBadge status={project.health} />
            </div>
          </Card>
          {tasks.length > 0 && (
            <div className="mt-3 space-y-2">
              {tasks.map((t) => (
                <Card key={t.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-white">
                      {t.title} {!t.client_visible && <span className="text-white/30">(internal)</span>}
                    </span>
                    <StatusBadge status={t.status} />
                  </div>
                  {t.internal_notes && <p className="mt-1 text-xs text-white/40">{t.internal_notes}</p>}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Recent Support Tickets</h2>
        <div className="mt-3 space-y-2">
          {(!tickets || tickets.length === 0) && (
            <Card>
              <p className="text-sm text-white/60">No support tickets.</p>
            </Card>
          )}
          {tickets?.map((t) => (
            <Card key={t.id} className="flex items-center justify-between p-4">
              <span className="text-sm text-white">{t.subject}</span>
              <StatusBadge status={t.status} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
