import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Toggles a single onboarding checklist item's completed state for the
 * signed-in user's organization. Uses the caller's own session (not the
 * admin client) — RLS's onboarding_responses_write policy already lets any
 * org member write their own org's rows, so there's no need to widen
 * access via a service-role bypass here.
 *
 * No rate limiting: this is an authenticated, RLS-scoped, idempotent
 * toggle on an 11-item checklist, not a public form — the shared
 * isRateLimited() helper's fixed 5-requests/60s window would otherwise
 * block someone checking off more than 5 items in a minute.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { itemId, completed } = (body ?? {}) as { itemId?: unknown; completed?: unknown };
  if (typeof itemId !== "string" || typeof completed !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 422 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ ok: false, error: "No business account found for your login." }, { status: 404 });
  }

  const { error } = await supabase.from("onboarding_responses").upsert(
    {
      organization_id: membership.organization_id,
      onboarding_item_id: itemId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "organization_id,onboarding_item_id" }
  );

  if (error) {
    console.error("Failed to toggle onboarding item", error);
    return NextResponse.json({ ok: false, error: "Could not save. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
