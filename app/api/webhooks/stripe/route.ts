import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { constructStripeWebhookEvent } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

// Route Handlers receive the raw body by default in the App Router (no
// bodyParser to disable) — required for Stripe signature verification.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  const event = constructStripeWebhookEvent(rawBody, signature);
  if (!event) {
    // Either Stripe isn't configured, or the signature didn't verify — in
    // both cases this is not a trusted event.
    return NextResponse.json({ error: "Invalid signature or Stripe not configured" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency guard: never process the same event twice.
  const { data: existing } = await admin
    .from("payment_webhook_events")
    .select("id")
    .eq("provider", "stripe")
    .eq("event_id", event.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await admin.from("payment_webhook_events").insert({
    provider: "stripe",
    event_id: event.id,
    event_type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId ?? session.client_reference_id;
        if (organizationId && session.subscription) {
          await admin
            .from("subscriptions")
            .update({
              status: "active",
              payment_provider: "stripe",
              stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
              stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
              current_period_start: new Date().toISOString(),
            })
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false })
            .limit(1);

          await admin.from("payments").insert({
            organization_id: organizationId,
            payment_provider: "stripe",
            status: "paid",
            amount_cents: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
            description: "Stripe Checkout session completed",
            paid_at: new Date().toISOString(),
          });

          await admin.from("activity_logs").insert({
            organization_id: organizationId,
            action: "subscription_activated",
            metadata: { provider: "stripe", stripeSubscriptionId: session.subscription },
          });

          const contact = await getOrgContactInfo(organizationId);
          await notifyOrganization({
            organizationId,
            type: "subscription_activated",
            title: "Your subscription is active",
            body: "Payment received — welcome aboard!",
            linkUrl: "/portal/",
          });
          if (contact?.email) {
            await sendEmail({
              to: contact.email,
              subject: "You're all set — your Acendia subscription is active",
              html: emailTemplates.subscriptionActivated(contact.orgName),
            });
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId =
          typeof (invoice as unknown as { subscription?: string }).subscription === "string"
            ? (invoice as unknown as { subscription: string }).subscription
            : null;
        if (stripeSubscriptionId) {
          const { data: sub } = await admin
            .from("subscriptions")
            .select("id, organization_id")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .maybeSingle();
          if (sub) {
            await admin
              .from("subscriptions")
              .update({ status: "active", current_period_end: new Date(invoice.period_end * 1000).toISOString() })
              .eq("id", sub.id);
            await admin.from("payments").insert({
              organization_id: sub.organization_id,
              subscription_id: sub.id,
              payment_provider: "stripe",
              status: "paid",
              amount_cents: invoice.amount_paid,
              currency: invoice.currency,
              stripe_invoice_id: invoice.id,
              description: "Recurring invoice paid",
              paid_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId =
          typeof (invoice as unknown as { subscription?: string }).subscription === "string"
            ? (invoice as unknown as { subscription: string }).subscription
            : null;
        if (stripeSubscriptionId) {
          const { data: sub } = await admin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .select("organization_id")
            .maybeSingle();
          if (sub) {
            await notifyOrganization({
              organizationId: sub.organization_id,
              type: "payment_failed",
              title: "Payment issue on your account",
              body: "Your latest payment didn't go through — please update your billing details.",
              linkUrl: "/portal/billing/",
            });
            const contact = await getOrgContactInfo(sub.organization_id);
            if (contact?.email) {
              await sendEmail({
                to: contact.email,
                subject: "Action needed: payment issue on your Acendia account",
                html: emailTemplates.paymentFailed(contact.orgName),
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "cancelled",
          unpaid: "past_due",
          paused: "paused",
          trialing: "trialing",
        };
        const mapped = statusMap[sub.status];
        if (mapped) {
          await admin
            .from("subscriptions")
            .update({ status: mapped, cancel_at_period_end: sub.cancel_at_period_end })
            .eq("stripe_subscription_id", sub.id);
        }
        break;
      }

      default:
        break;
    }

    await admin
      .from("payment_webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("provider", "stripe")
      .eq("event_id", event.id);
  } catch (err) {
    console.error("Stripe webhook processing failed", event.type, err);
    // Still return 200 for a signature-verified event we've recorded — a
    // 5xx here would cause Stripe to retry an event we may have partially
    // applied. The unprocessed row (processed_at null) is visible to staff
    // for manual follow-up.
  }

  return NextResponse.json({ received: true });
}
