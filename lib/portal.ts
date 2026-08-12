import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { requireAuth } from "./auth";

/**
 * Shared context for every /portal/* page: who's signed in, which
 * organization they belong to, and that org's basics. Redirects to
 * /register/ if a signed-in user somehow has no organization yet (e.g. they
 * verified email but never finished the registration wizard's business
 * step) rather than rendering a broken dashboard.
 *
 * Wrapped in React's cache() so the layout and the page it wraps (both of
 * which call this per request) share one set of queries instead of
 * doubling every request.
 */
export const getPortalContext = cache(async function getPortalContext() {
  const { user, profile } = await requireAuth();
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    redirect("/register/");
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, onboarding_status")
    .eq("id", membership.organization_id)
    .maybeSingle();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status, plan_id, billing_cycle, current_period_end, cancel_at_period_end, payment_provider")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    user,
    profile,
    organizationId: membership.organization_id,
    orgRole: membership.role,
    orgName: org?.name ?? "Your business",
    onboardingStatus: org?.onboarding_status ?? "not_started",
    subscription: subscription ?? null,
  };
});

export type PortalContext = Awaited<ReturnType<typeof getPortalContext>>;
