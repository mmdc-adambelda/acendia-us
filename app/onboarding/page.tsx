import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import OnboardingChecklist from "@/components/onboarding/OnboardingChecklist";
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

  return (
    <div className="min-h-screen py-14 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Welcome{orgName ? `, ${orgName}` : ""} — let's get you onboarded
        </h1>
        <p className="mt-3 text-white/60">
          Complete these steps so we can start work as quickly as possible — click any item to check it off. Your
          account team can also help you complete any of these directly.
        </p>

        <div className="mt-8">
          <OnboardingChecklist
            items={(items ?? []).map((i) => ({ id: i.id, label: i.label, description: i.description }))}
            initialCompletedIds={Array.from(completedIds)}
          />
        </div>

        <p className="mt-8 text-sm text-white/40">
          Need help with any of these?{" "}
          <Link href="/contact/" className="underline hover:text-white">
            Contact your account team
          </Link>
          . You can also track this checklist anytime from{" "}
          <Link href="/portal/" className="underline hover:text-white">
            your portal
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
