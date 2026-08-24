import "server-only";
import { createClient } from "./supabase/server";

export type ActivePlan = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  plan_type: string;
  setup_fee_cents: number | null;
  monthly_price_cents: number | null;
  stripe_price_id_monthly: string | null;
  features: string[];
};

/**
 * Fetches active plans for /pricing and /register. Never throws — both of
 * those are pages real visitors (not just logged-in clients) can hit, so a
 * misconfigured or momentarily-unreachable Supabase project must degrade
 * to "no plans available" rather than a 500. Both pages already have a
 * "contact us" fallback UI for the empty-array case.
 */
export async function getActivePlans(): Promise<ActivePlan[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select(
        "id, name, slug, description, plan_type, setup_fee_cents, monthly_price_cents, stripe_price_id_monthly, features",
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Failed to fetch plans:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("getActivePlans failed (Supabase may not be configured yet):", err);
    return [];
  }
}
