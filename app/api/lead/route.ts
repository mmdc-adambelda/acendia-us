import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/leadSchema";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = leadFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form for errors.", issues: result.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot tripped — silently accept to avoid tipping off bots, but drop it.
  if (result.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const { company_website: _honeypot, ...lead } = result.data;
  void _honeypot;

  // CRM-ready submission structure. Wire this up to GoHighLevel once the
  // webhook URL is available — read from an env var, never hardcoded here.
  const crmWebhookUrl = process.env.GHL_WEBHOOK_URL;

  if (crmWebhookUrl) {
    try {
      await fetch(crmWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, submittedAt: new Date().toISOString(), source: "acendia.us" }),
      });
    } catch (err) {
      console.error("Failed to forward lead to CRM webhook", err);
      // Don't fail the user-facing request just because the downstream
      // webhook is unavailable — the submission is still logged below.
    }
  } else {
    console.log("New lead (no CRM webhook configured):", {
      ...lead,
      submittedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
