import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Toggles a single onboarding checklist item's completed state for the
 * signed-in user's organization. Uses the caller's own session (not the
 * admin client) — RLS's onboarding_responses_write policy already lets any
 * org member write their own org's rows, so there's no need to widen
 * access via a service-role bypass here.
 *
 * Deliberately a plain HTML form target (parses req.formData(), always
 * responds with a real redirect back to /onboarding/) instead of a
 * fetch()-driven JSON API — same reasoning as
 * app/api/checkout/create/route.ts: a real top-level form submission is
 * far more resistant to a browser/extension silently withholding the
 * session cookie than a JS fetch() call is, which is exactly the failure
 * mode this app hit live.
 *
 * No rate limiting: this is an authenticated, RLS-scoped, idempotent
 * toggle on an 11-item checklist, not a public form — the shared
 * isRateLimited() helper's fixed 5-requests/60s window would otherwise
 * block someone checking off more than 5 items in a minute.
 */
export async function POST(req: NextRequest) {
  // Deliberately stays on whatever host this request actually arrived on
  // (req.url) — see the note in app/api/checkout/create/route.ts for why
  // this isn't forced through NEXT_PUBLIC_APP_URL.
  const redirectToOnboarding = (error?: string) => {
    const url = new URL("/onboarding/", req.url);
    if (error) url.searchParams.set("error", error);
    return NextResponse.redirect(url, 303);
  };

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectToOnboarding("Invalid request.");
  }

  const itemId = formData.get("itemId");
  const completed = formData.get("completed");
  if (typeof itemId !== "string" || (completed !== "true" && completed !== "false")) {
    return redirectToOnboarding("Invalid request.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirectToOnboarding("Please log in.");
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return redirectToOnboarding("No business account found for your login.");
  }

  const isCompleted = completed === "true";
  const { error } = await supabase.from("onboarding_responses").upsert(
    {
      organization_id: membership.organization_id,
      onboarding_item_id: itemId,
      completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    },
    { onConflict: "organization_id,onboarding_item_id" }
  );

  if (error) {
    console.error("Failed to toggle onboarding item", error);
    return redirectToOnboarding("Could not save. Please try again.");
  }

  return redirectToOnboarding();
}
