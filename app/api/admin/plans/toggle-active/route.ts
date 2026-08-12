import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({ planId: z.string().uuid(), isActive: z.boolean() });

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
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 422 });

  // plans_write RLS policy is admin_or_above only — a staff-role caller
  // gets 0 rows updated, surfaced as a 403 below.
  const { data, error } = await supabase
    .from("plans")
    .update({ is_active: parsed.data.isActive })
    .eq("id", parsed.data.planId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Not authorized (admin role required) or plan not found." }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
