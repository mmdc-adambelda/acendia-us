import { NextRequest, NextResponse } from "next/server";
import { verifyPaypalWebhookSignature } from "@/lib/payments/paypal";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

type PaypalWebhookEvent = {
  id: string;
  event_type: string;
  resource: {
    id?: string;
    custom_id?: string;
    plan_id?: string;
    status?: string;
    billing_agreement_id?: string;
    amount?: { total?: string; currency_code?: string };
  };
};

export async function POST(req: NextRequest) {
  let body: PaypalWebhookEvent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const verified = await verifyPaypalWebhookSignature({ headers: req.headers, body });
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature or PayPal not configured" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("payment_webhook_events")
    .select("id")
    .eq("provider", "paypal")
    .eq("event_id", body.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await admin.from("payment_webhook_events").insert({
    provider: "paypal",
    event_id: body.id,
    event_type: body.event_type,
    payload: body as unknown as Record<string, unknown>,
  });

  try {
    const organizationId = body.resource?.custom_id;
    const paypalSubscriptionId = body.resource?.id;

    switch (body.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        if (organizationId && paypalSubscriptionId) {
          await admin
            .from("subscriptions")
            .update({
              status: "active",
              payment_provider: "paypal",
              paypal_subscription_id: paypalSubscriptionId,
              current_period_start: new Date().toISOString(),
            })
            .eq("organization_id", organizationId)
            .order("created_at", { ascending: false })
            .limit(1);

          await admin.from("activity_logs").insert({
            organization_id: organizationId,
            action: "subscription_activated",
            metadata: { provider: "paypal", paypalSubscriptionId },
          });

          await notifyOrganization({
            organizationId,
            type: "subscription_activated",
            title: "Your subscription is active",
            body: "Payment received — welcome aboard!",
            linkUrl: "/portal/",
          });
          const contact = await getOrgContactInfo(organizationId);
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

      case "PAYMENT.SALE.COMPLETED": {
        if (paypalSubscriptionId) {
          const { data: sub } = await admin
            .from("subscriptions")
            .select("id, organization_id")
            .eq("paypal_subscription_id", paypalSubscriptionId)
            .maybeSingle();
          if (sub) {
            await admin.from("payments").insert({
              organization_id: sub.organization_id,
              subscription_id: sub.id,
              payment_provider: "paypal",
              status: "paid",
              amount_cents: Math.round(parseFloat(body.resource?.amount?.total ?? "0") * 100),
              currency: (body.resource?.amount?.currency_code ?? "usd").toLowerCase(),
              paypal_transaction_id: body.resource?.id ?? null,
              description: "PayPal subscription payment",
              paid_at: new Date().toISOString(),
            });
            await admin.from("subscriptions").update({ status: "active" }).eq("id", sub.id);
          }
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        if (paypalSubscriptionId) {
          await admin
            .from("subscriptions")
            .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
            .eq("paypal_subscription_id", paypalSubscriptionId);
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.SUSPENDED":
      case "PAYMENT.SALE.DENIED": {
        if (paypalSubscriptionId) {
          const { data: sub } = await admin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("paypal_subscription_id", paypalSubscriptionId)
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

      default:
        break;
    }

    await admin
      .from("payment_webhook_events")
      .update({ processed_at: new Date().toISOString() })
      .eq("provider", "paypal")
      .eq("event_id", body.id);
  } catch (err) {
    console.error("PayPal webhook processing failed", body.event_type, err);
  }

  return NextResponse.json({ received: true });
}
