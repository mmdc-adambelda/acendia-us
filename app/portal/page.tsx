import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/Card";
import StatusBadge, { labelize } from "@/components/portal/StatusBadge";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Client Portal",
  description: "Your Acendia client portal.",
  path: "/portal/",
  noIndex: true,
});

export default async function PortalPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, stage, health, started_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let tasks: { id: string; title: string; status: string; due_date: string | null }[] = [];
  let actionRequired: { id: string; title: string }[] = [];
  if (project) {
    const { data } = await supabase
      .from("tasks")
      .select("id, title, status, due_date")
      .eq("project_id", project.id)
      .eq("client_visible", true)
      .order("updated_at", { ascending: false })
      .limit(6);
    tasks = data ?? [];
    actionRequired = tasks.filter((t) => t.status === "waiting_for_client");
  }

  const { data: latestReport } = await supabase
    .from("reports")
    .select("id, month, published_at")
    .eq("organization_id", ctx.organizationId)
    .not("published_at", "is", null)
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  const subStatus = ctx.subscription?.status ?? "pending";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back, {ctx.profile?.first_name ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-white/50">{ctx.orgName}</p>
        </div>
        <StatusBadge status={subStatus} />
      </div>

      {subStatus === "pending" && (
        <Card className="mt-6 border-amber-400/30 bg-amber-400/5">
          <p className="text-sm text-amber-200">
            Your subscription isn't active yet.{" "}
            {/* prefetch=false: this link's target re-checks the session
                server-side (requireAuth in app/checkout/page.tsx) — letting
                Next.js prefetch it in the background risks a second,
                concurrent Supabase token refresh alongside the real
                navigation, which can invalidate the session outright (see
                proxy.ts's isPrefetchRequest for the full explanation). */}
            <Link href="/checkout/" prefetch={false} className="underline">
              Complete checkout
            </Link>{" "}
            to get your campaign started.
          </p>
        </Card>
      )}
      {subStatus === "past_due" && (
        <Card className="mt-6 border-red-400/30 bg-red-400/5">
          <p className="text-sm text-red-200">
            Your last payment didn&apos;t go through.{" "}
            <Link href="/portal/billing/" className="underline">
              Update your billing
            </Link>{" "}
            to avoid a pause in service.
          </p>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-sm font-medium text-white/50">Campaign Health</h2>
          <div className="mt-2">
            {project ? <StatusBadge status={project.health} /> : <span className="text-sm text-white/40">Not started yet</span>}
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-medium text-white/50">Campaign Stage</h2>
          <p className="mt-2 text-sm text-white">{project ? labelize(project.stage) : "Awaiting kickoff"}</p>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Current Work</h2>
          <Link href="/portal/tasks/" className="focus-ring text-sm text-white/50 hover:text-white">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {tasks.length === 0 && (
            <Card>
              <p className="text-sm text-white/50">
                No work items yet — once onboarding wraps up, your account team will populate your campaign tasks
                here.
              </p>
            </Card>
          )}
          {tasks.map((t) => (
            <Card key={t.id} className="flex items-center justify-between p-4">
              <span className="text-sm text-white">{t.title}</span>
              <StatusBadge status={t.status} />
            </Card>
          ))}
        </div>
      </div>

      {actionRequired.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white">Action Required From You</h2>
          <div className="mt-3 space-y-2">
            {actionRequired.map((t) => (
              <Card key={t.id} className="border-amber-400/30 bg-amber-400/5 p-4">
                <span className="text-sm text-amber-100">{t.title}</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card href="/portal/reports/">
          <h2 className="text-sm font-medium text-white/50">Latest Report</h2>
          <p className="mt-2 text-sm text-white">
            {latestReport
              ? new Date(latestReport.month).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "No reports published yet"}
          </p>
        </Card>
        <Card href="/portal/billing/">
          <h2 className="text-sm font-medium text-white/50">Billing</h2>
          <p className="mt-2 text-sm text-white">
            {ctx.subscription?.current_period_end
              ? `Renews ${new Date(ctx.subscription.current_period_end).toLocaleDateString("en-US")}`
              : "View plan & payment history"}
          </p>
        </Card>
      </div>
    </div>
  );
}
