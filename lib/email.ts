import "server-only";
import { Resend } from "resend";

let cachedClient: Resend | null = null;

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cachedClient) cachedClient = new Resend(key);
  return cachedClient;
}

/**
 * Sends a transactional email. Never throws — if RESEND_API_KEY isn't set
 * or the send fails, this logs and returns false rather than breaking the
 * caller's flow (a payment webhook, a support ticket submission, etc. must
 * always finish successfully even if the "nice to have" email doesn't go
 * out). Same resilience pattern as lib/plans.ts / lib/payments/*.
 */
export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<boolean> {
  const client = getResendClient();
  const from = process.env.EMAIL_FROM;
  if (!client || !from) {
    console.log(`[email skipped — Resend not configured] to=${params.to} subject="${params.subject}"`);
    return false;
  }
  try {
    const result = await client.emails.send({ from, to: params.to, subject: params.subject, html: params.html });
    if (result.error) {
      console.error("Resend send failed", result.error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("sendEmail failed", err);
    return false;
  }
}

export function getAdminNotificationEmail(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? null;
}

function wrapEmailHtml(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#fff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;padding:32px;">
            <tr><td style="font-size:18px;font-weight:600;color:#fff;padding-bottom:16px;">${title}</td></tr>
            <tr><td style="font-size:14px;line-height:1.6;color:#ccc;">${bodyHtml}</td></tr>
            <tr><td style="padding-top:24px;font-size:12px;color:#666;">Acendia International — YOUR Business, OUR Business</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const emailTemplates = {
  subscriptionActivated: (orgName: string) =>
    wrapEmailHtml(
      "You're all set!",
      `<p>Hi ${orgName},</p><p>Your Acendia subscription is now active. Log in to your portal to continue onboarding and track your campaign.</p>`,
    ),
  wisePaymentConfirmed: (orgName: string) =>
    wrapEmailHtml(
      "Payment confirmed",
      `<p>Hi ${orgName},</p><p>We've confirmed your Wise transfer and activated your subscription. Welcome aboard!</p>`,
    ),
  paymentFailed: (orgName: string) =>
    wrapEmailHtml(
      "Payment issue on your account",
      `<p>Hi ${orgName},</p><p>Your latest payment didn't go through. Please update your billing details in the client portal to avoid a pause in service.</p>`,
    ),
  newMessage: (orgName: string) =>
    wrapEmailHtml("New message from Acendia", `<p>Hi ${orgName},</p><p>Your account team just sent you a new message. Log in to your portal to read and reply.</p>`),
  newReport: (orgName: string, month: string) =>
    wrapEmailHtml("Your monthly report is ready", `<p>Hi ${orgName},</p><p>Your ${month} performance report is now available in your portal.</p>`),
  adminNewClientMessage: (orgName: string) =>
    wrapEmailHtml("New client message", `<p>${orgName} just sent a new message in the client portal.</p>`),
  adminNewSupportTicket: (orgName: string, subject: string) =>
    wrapEmailHtml("New support ticket", `<p>${orgName} submitted a new support ticket: "${subject}".</p>`),
  adminNewSignup: (orgName: string) =>
    wrapEmailHtml("New client signup", `<p>${orgName} just completed registration on acendia.us.</p>`),
};
