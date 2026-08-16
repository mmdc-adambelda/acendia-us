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
  let user;
  try {
    const supabase = await createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    if (!sessionUser) return null;
    user = sessionUser;

    // Profile lookup is deliberately outside the "is there a session at
    // all" question above: a transient/failed profile read must never be
    // treated as "not logged in" — that's a real, valid session getting
    // silently bounced to /login (found live: clicking a link from an
    // already-authenticated /portal page briefly looked like a full
    // sign-out, purely because this single query hiccuped once). Callers
    // that truly need the profile row already handle `profile: null`
    // (e.g. `ctx.profile?.first_name ?? "there"`).
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) {
      console.error("getCurrentUser: profile fetch failed for a signed-in user", { userId: user.id, profileError });
    }

    return { user, profile: profile ?? null };
  } catch (err) {
    // A thrown error this far in only happens if `supabase.auth.getUser()`
    // itself failed (config/network) — profile-fetch errors are handled
    // above and never reach here. If somehow `user` was already resolved,
    // still return a valid session rather than treating a downstream
    // hiccup as a sign-out.
    console.error("getCurrentUser failed (Supabase may not be configured yet, or a transient error occurred):", err);
    return user ? { user, profile: null } : null;
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
