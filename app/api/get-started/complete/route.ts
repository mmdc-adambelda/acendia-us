import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStartedCompleteSchema } from "@/lib/validation/getStarted";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates, getAdminNotificationEmail } from "@/lib/email";
import { retrieveStripeCheckoutSession } from "@/lib/payments/stripe";
import type Stripe from "stripe";

/**
 * Creates the Acendia account for the "pay first, tell us who you are
 * after" homepage flow — the ONE place this happens for that flow. Plain
 * HTML form target (parses req.formData(), always redirects, never JSON)
 * for the same reason as every other session-dependent form in this app
 * — see app/api/checkout/create/route.ts's long comment.
 *
 * Security-critical: this endpoint receives a client-submitted sessionId
 * claiming a payment succeeded. It NEVER trusts that claim — it re-
 * retrieves the session directly from Stripe's API and only proceeds if
 * Stripe itself confirms payment_status === "paid". Nothing here (account
 * creation, org creation, subscription scheduling) happens on the
 * strength of anything the browser sent alone.
 */
export async function POST(req: NextRequest) {
  const redirectToForm = (message: string, sessionId?: string) => {
    const url = new URL("/get-started/thank-you/", req.url);
    if (sessionId) url.searchParams.set("session_id", sessionId);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, 303);
  };

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`get-started-complete:${ip}`)) {
    return redirectToForm("Too many requests. Try again shortly.");
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectToForm("Invalid request. Please try again.");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = getStartedCompleteSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return redirectToForm(firstIssue?.message ?? "Please check the form for errors.", String(raw.sessionId ?? ""));
  }
  const data = parsed.data;

  // Re-verify the payment directly against Stripe — never trust the form.
  const session = await retrieveStripeCheckoutSession(data.sessionId);
  if (!session || session.payment_status !== "paid" || session.mode !== "subscription") {
    return redirectToForm("We couldn't verify your payment. Please contact us and we'll sort it out directly.", data.sessionId);
  }

  const admin = createAdminClient();

  // subscription (and its latest_invoice) are expanded by
  // retrieveStripeCheckoutSession — this is the subscription Stripe
  // created (and already started billing) the moment checkout succeeded.
  const subscription = session.subscription as Stripe.Subscription | null;
  const latestInvoice = subscription?.latest_invoice as Stripe.Invoice | null;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;

  // Idempotency: a page refresh or double-submit on this same paid
  // session must not create a second account/org. The subscription ID is
  // a simpler, more robust key here than digging through the newer
  // Invoice API's nested payments list for a payment_intent ID.
  if (subscription) {
    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("organization_id")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle();
    if (existingSub) {
      return NextResponse.redirect(new URL("/get-started/success/", req.url), 303);
    }
  }

  // Stripe's own collected email (from the payment form itself) is more
  // trustworthy than the onboarding form's email field — prefer it, fall
  // back to the form's value only if Stripe somehow didn't have one.
  const email = session.customer_details?.email || data.email;

  // 1. Create the Supabase auth account. The customer never sets a
  // password here — a random one is generated and immediately discarded;
  // they set their real one via the recovery link emailed below.
  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password: crypto.randomUUID() + "Aa1!",
    email_confirm: true,
  });
  if (createUserError || !created.user) {
    console.error("get-started/complete: failed to create user", createUserError);
    const alreadyRegistered = createUserError?.message?.toLowerCase().includes("already registered");
    return redirectToForm(
      alreadyRegistered
        ? "An account already exists for this email. Please contact us and we'll link your payment to your existing account."
        : "Something went wrong creating your account. Please contact us — your payment is safe and recorded.",
      data.sessionId,
    );
  }
  const userId = created.user.id;

  await admin.from("profiles").upsert({ id: userId, first_name: data.contactName, phone: data.phone });

  // 2. Create the organization + membership + website.
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: data.businessName,
      industry: data.primaryService,
      city: data.city,
      state: data.state,
      zip: data.zip || null,
      address: data.address || null,
      phone: data.phone,
    })
    .select("id")
    .single();

  if (orgError || !org) {
    console.error("get-started/complete: failed to create organization", orgError);
    return redirectToForm("Something went wrong setting up your account. Please contact us — your payment is safe.", data.sessionId);
  }

  await admin.from("organization_members").insert({ organization_id: org.id, user_id: userId, role: "owner" });

  const competitorsList = data.competitors ? data.competitors.split(",").map((c) => c.trim()).filter(Boolean) : [];
  await admin.from("websites").insert({
    organization_id: org.id,
    url: data.websiteUrl || "",
    primary_service: data.primaryService,
    competitors: competitorsList,
  });

  // Keywords/notes aren't first-class columns yet — same pattern as the
  // old registration wizard's "goals" (see app/api/register/complete):
  // stored on the activity trail so nothing is lost.
  const planId = session.metadata?.planId ?? null;
  await admin.from("activity_logs").insert({
    organization_id: org.id,
    action: "get_started_onboarding_captured",
    metadata: { keywords: data.keywords, notes: data.notes, planId },
  });

  // 3. Record the first month's payment (already succeeded via Stripe —
  // the subscription-mode Checkout Session charged it immediately, no
  // separate setup fee).
  await admin.from("payments").insert({
    organization_id: org.id,
    payment_provider: "stripe",
    status: "paid",
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    stripe_invoice_id: latestInvoice?.id ?? null,
    description: "First month — SEO, website, and Google Business Profile setup",
    paid_at: new Date().toISOString(),
  });

  // 4. Record the subscription Stripe already created and started billing
  // as part of checkout — unlike the older setup-fee flow, there's no
  // separate "schedule it later" step here.
  if (planId && subscription) {
    const currentPeriodStart = subscription.items.data[0]?.current_period_start;
    const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
    await admin.from("subscriptions").insert({
      organization_id: org.id,
      plan_id: planId,
      billing_cycle: "monthly",
      payment_provider: "stripe",
      status: subscription.status === "active" ? "active" : "pending",
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
      current_period_start: currentPeriodStart ? new Date(currentPeriodStart * 1000).toISOString() : null,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    });
  } else {
    console.error("get-started/complete: Stripe session had no planId/subscription — no subscription row created", {
      organizationId: org.id,
    });
  }

  // 5. Email the customer a link to set their own password, and notify staff.
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (linkError) {
    console.error("get-started/complete: failed to generate password-set link", linkError);
  } else if (linkData.properties?.action_link) {
    await sendEmail({
      to: email,
      subject: "Payment received — set your password to get started",
      html: emailTemplates.welcomeSetPassword(data.businessName, linkData.properties.action_link),
    });
  }

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New client signup: ${data.businessName}`,
      html: emailTemplates.adminNewSignup(data.businessName),
    });
  }

  return NextResponse.redirect(new URL("/get-started/success/", req.url), 303);
}
