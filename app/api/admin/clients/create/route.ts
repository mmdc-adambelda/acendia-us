import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  businessName: z.string().trim().min(1).max(200),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(50).optional().or(z.literal("")),
  planId: z.string().uuid().optional().or(z.literal("")),
});

/**
 * Staff-only manual client creation — for onboarding a client over the
 * phone/email rather than through self-serve /register. Creates a real
 * Supabase Auth user (no password set), an organization, and an
 * organization_members row, then returns a Supabase password-set link for
 * staff to send the client directly (email delivery isn't assumed here —
 * see CLIENT-PORTAL-IMPLEMENTATION.md Phase 5 for Resend wiring).
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { data: callerProfile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!callerProfile || !["staff", "admin", "super_admin"].includes(callerProfile.role)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

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
  const { email, firstName, lastName, businessName, city, state, planId } = parsed.data;

  const admin = createAdminClient();

  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (createUserError || !created.user) {
    console.error("Admin client creation: createUser failed", createUserError);
    const msg = createUserError?.message?.includes("already been registered")
      ? "A user with this email already exists."
      : "Could not create user account.";
    return NextResponse.json({ ok: false, error: msg }, { status: 422 });
  }

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({ name: businessName, city: city || null, state: state || null })
    .select("id")
    .single();

  if (orgError || !org) {
    console.error("Admin client creation: organization insert failed", orgError);
    return NextResponse.json({ ok: false, error: "Could not create the business record." }, { status: 500 });
  }

  await admin.from("organization_members").insert({ organization_id: org.id, user_id: created.user.id, role: "owner" });

  if (planId) {
    await admin.from("subscriptions").insert({
      organization_id: org.id,
      plan_id: planId,
      billing_cycle: "monthly",
      status: "pending",
    });
  }

  await admin.from("activity_logs").insert({
    organization_id: org.id,
    actor_id: user.id,
    action: "client_manually_created",
    metadata: { createdBy: user.id, email },
  });

  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (linkError) {
    console.error("Admin client creation: generateLink failed", linkError);
  }

  return NextResponse.json({
    ok: true,
    organizationId: org.id,
    passwordSetLink: link?.properties?.action_link ?? null,
  });
}
