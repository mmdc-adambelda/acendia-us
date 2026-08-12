import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  subscriptionId: z.string().uuid(),
  status: z.enum(["pending", "trialing", "active", "past_due", "paused", "cancelled", "expired"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 422 });
  }

  // subscriptions_write_staff RLS policy enforces this update is only
  // possible for staff/admin/super_admin — this call fails silently (0
  // rows updated) for anyone else, which we treat as a hard error below.
  const { data: sub, error } = await supabase
    .from("subscriptions")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.subscriptionId)
    .select("id, organization_id")
    .maybeSingle();

  if (error || !sub) {
    return NextResponse.json({ ok: false, error: "Not authorized or subscription not found." }, { status: 403 });
  }

  const admin = createAdminClient();
  await admin.from("activity_logs").insert({
    organization_id: sub.organization_id,
    actor_id: user.id,
    action: "subscription_status_changed_manually",
    metadata: { subscriptionId: sub.id, newStatus: parsed.data.status },
  });

  return NextResponse.json({ ok: true });
}
