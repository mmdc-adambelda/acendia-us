import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Onboarding",
  description: "Complete your Acendia onboarding checklist.",
  path: "/onboarding/",
  noIndex: true,
});

export default async function OnboardingPage() {
  await requireAuth();
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  let orgName: string | undefined;
  if (membership?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", membership.organization_id)
      .maybeSingle();
    orgName = org?.name;
  }

  const { data: items } = await supabase
    .from("onboarding_items")
    .select("id, label, description, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  let completedIds = new Set<string>();
  if (membership?.organization_id) {
    const { data: responses } = await supabase
      .from("onboarding_responses")
      .select("onboarding_item_id, completed")
      .eq("organization_id", membership.organization_id)
      .eq("completed", true);
    completedIds = new Set((responses ?? []).map((r) => r.onboarding_item_id));
  }

  const total = items?.length ?? 0;
  const completed = items?.filter((i) => completedIds.has(i.id)).length ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen py-14 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Welcome{orgName ? `, ${orgName}` : ""} — let's get you onboarded
        </h1>
        <p className="mt-3 text-white/60">
          Complete these steps so we can start work as quickly as possible. Your account team can also help you
          complete any of these directly.
        </p>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-white/60">
            <span>{completed} of {total} complete</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <ul className="mt-8 space-y-3">
          {(items ?? []).map((item) => {
            const done = completedIds.has(item.id);
            return (
              <Card key={item.id} className="flex items-start gap-3 p-4">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    done ? "border-white bg-white text-black" : "border-[var(--border-hi)] text-transparent"
                  }`}
                >
                  ✓
                </span>
                <div>
                  <p className={`text-sm font-medium ${done ? "text-white/50 line-through" : "text-white"}`}>
                    {item.label}
                  </p>
                  {item.description && <p className="mt-0.5 text-xs text-white/45">{item.description}</p>}
                </div>
              </Card>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-white/40">
          Need help with any of these?{" "}
          <Link href="/contact/" className="underline hover:text-white">
            Contact your account team
          </Link>
          . Once your subscription is active, you'll be able to check these off directly from{" "}
          <Link href="/portal/" className="underline hover:text-white">
            your portal
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
