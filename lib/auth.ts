import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { UserRole } from "./supabase/database.types";

/**
 * Returns the signed-in user + their profile, or null. Use this in Server
 * Components/Actions that need to know "who is this, if anyone" without
 * forcing a redirect (e.g. the header, which shows different CTAs for
 * signed-in vs. anonymous visitors).
 *
 * Never throws — if Supabase isn't configured yet (missing env vars) or a
 * request fails, this resolves to null rather than crashing the page. Auth
 * pages degrade to "not signed in" instead of 500ing.
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile };
  } catch (err) {
    console.error("getCurrentUser failed (Supabase may not be configured yet):", err);
    return null;
  }
}

/**
 * Use at the top of any /portal or /onboarding Server Component. Redirects
 * to /login if there's no session. This is a UX convenience — RLS is what
 * actually stops a signed-in-but-unauthorized read, not this function.
 */
export async function requireAuth() {
  const current = await getCurrentUser();
  if (!current) redirect("/login/");
  return current;
}

/**
 * Use at the top of any /admin Server Component. Redirects non-staff users
 * back to the public site rather than exposing a 403 with information
 * about what exists behind the wall.
 */
export async function requireRole(allowed: UserRole[]) {
  const current = await requireAuth();
  if (!allowed.includes(current.profile?.role ?? "client")) {
    redirect("/portal/");
  }
  return current;
}
