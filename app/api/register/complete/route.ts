import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { registerCompleteSchema } from "@/lib/validation/register";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates, getAdminNotificationEmail } from "@/lib/email";

/**
 * Persists the business/website/goals/plan data collected across the
 * registration wizard, once Supabase Auth has already created the user
 * (client-side, via supabase.auth.signUp() in step 1). Email confirmation
 * is off for this project, so signUp() already returns a live session by
 * the time this runs — but this endpoint still uses the admin (service
 * role) client rather than the caller's cookie session, deliberately:
 *   1. Verifies `userId` actually corresponds to a real, just-created auth
 *      user (proving signUp() succeeded for this exact account) rather
 *      than trusting a cookie that could theoretically lag the browser's
 *      just-written one by a request or two.
 *   2. Only ever INSERTs a brand-new organization for that user — it never
 *      updates or reads another organization's data, so there's no path
 *      for this to leak or corrupt existing client data even without a
 *      session check.
 * This is the one deliberate, narrowly-scoped exception to "always check
 * the caller's session" in this codebase — see
 * CLIENT-PORTAL-IMPLEMENTATION.md for the reasoning.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`register-complete:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = registerCompleteSchema.safeParse(body);
  if (!result.success) {
    // .flatten() only handles depth-1 paths well — this schema nests fields
    // under account/business/website/goals/plan, so a flat "path: message"
    // list (however deep) is what actually lets the client tell someone
    // which specific field failed, instead of "please check the form."
    const fieldIssues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return NextResponse.json(
      { ok: false, error: "Please check the form for errors.", issues: result.error.flatten(), fieldIssues },
      { status: 422 }
    );
  }

  const { userId, account, business, website, goals, plan } = result.data;
  const admin = createAdminClient();

  // 1. Confirm this user really exists. We check auth.users directly (the
  // real source of truth for "did signUp() succeed for this id") rather
  // than the profiles table, because the on_auth_user_created trigger that
  // is supposed to auto-create the matching profiles row can occasionally
  // fire late (or not at all, if a project's trigger wasn't fully applied)
  // — found live: signUp() succeeded and returned a real user, but the
  // profiles row wasn't there yet by the time this endpoint ran, hard-
  // blocking every registration with a false "account not found" error.
  const { data: authUser, error: authUserError } = await admin.auth.admin.getUserById(userId);
  if (authUserError || !authUser.user) {
    return NextResponse.json(
      { ok: false, error: "We couldn't find your account. Please restart registration." },
      { status: 404 }
    );
  }

  // 2. Self-heal: if the trigger hasn't created the profile row yet, create
  // it now from the data the client already collected in step 1. Safe to
  // do unconditionally (upsert) since we've just proven userId is a real,
  // already-authenticated Supabase user — this never creates a profile for
  // an id that isn't a genuine account.
  const { error: profileUpsertError } = await admin.from("profiles").upsert({
    id: userId,
    first_name: account.firstName,
    last_name: account.lastName,
    phone: account.phone,
  });
  if (profileUpsertError) {
    console.error("Failed to upsert profile during registration completion", profileUpsertError);
    return NextResponse.json(
      { ok: false, error: "Something went wrong finishing your account. Please try again." },
      { status: 500 }
    );
  }

  // 2. Refuse to run twice for the same user (idempotency — a page refresh
  // or double-submit must not create a second organization).
  const { data: existingMembership } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingMembership) {
    return NextResponse.json({ ok: true, organizationId: existingMembership.organization_id, alreadyExisted: true });
  }

  // 3. Create the organization + membership + website.
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: business.businessName,
      industry: business.industry,
      employee_count: business.employeeCount,
      city: business.city,
      state: business.state,
      zip: business.zip || null,
      address: business.address || null,
    })
    .select("id")
    .single();

  if (orgError || !org) {
    console.error("Failed to create organization during registration", orgError);
    return NextResponse.json({ ok: false, error: "Something went wrong creating your account. Please try again." }, { status: 500 });
  }

  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: org.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    console.error("Failed to create organization_members row during registration", memberError);
    return NextResponse.json({ ok: false, error: "Something went wrong linking your account. Please try again." }, { status: 500 });
  }

  const competitorsList = website.competitors
    ? website.competitors.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  await admin.from("websites").insert({
    organization_id: org.id,
    url: website.websiteUrl,
    primary_service: website.primaryService,
    current_seo_provider: website.currentSeoProvider || null,
    google_business_profile_url: website.googleBusinessProfileUrl || null,
    competitors: competitorsList,
    approx_monthly_leads: website.approxMonthlyLeads || null,
    approx_monthly_traffic: website.approxMonthlyTraffic || null,
    primary_challenge: website.primaryChallenge || null,
  });

  if (website.targetCity || website.targetState) {
    await admin.from("locations").insert({
      organization_id: org.id,
      label: [website.targetCity, website.targetState].filter(Boolean).join(", "),
      city: website.targetCity || null,
      state: website.targetState || null,
      is_primary: true,
    });
  }

  // Goals aren't a first-class table yet in this phase — stored on the
  // organization's onboarding trail via activity_logs so nothing is lost,
  // and surfaced properly once /portal reads it back in Phase 3.
  await admin.from("activity_logs").insert({
    organization_id: org.id,
    action: "registration_goals_captured",
    metadata: { goals, requestedPlanId: plan.planId, billingCycle: plan.billingCycle, addonPlanIds: plan.addonPlanIds },
  });

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New client signup: ${business.businessName}`,
      html: emailTemplates.adminNewSignup(business.businessName),
    });
  }

  return NextResponse.json({ ok: true, organizationId: org.id, alreadyExisted: false });
}
