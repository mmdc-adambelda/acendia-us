import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  organizationName: z.string().trim().min(1).max(200),
});

/**
 * Updates the caller's own profile row and their organization's name.
 * Runs against the caller's session (not the admin client) so RLS itself
 * enforces they can only touch their own profile/org — no explicit
 * ownership check needed here beyond what the policies already require.
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form for errors." }, { status: 422 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ first_name: parsed.data.firstName, last_name: parsed.data.lastName, phone: parsed.data.phone || null })
    .eq("id", user.id);

  if (profileError) {
    console.error("Failed to update profile", profileError);
    return NextResponse.json({ ok: false, error: "Could not save your changes." }, { status: 500 });
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (membership) {
    const { error: orgError } = await supabase
      .from("organizations")
      .update({ name: parsed.data.organizationName })
      .eq("id", membership.organization_id);
    if (orgError) {
      console.error("Failed to update organization", orgError);
      return NextResponse.json({ ok: false, error: "Could not save business name." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
