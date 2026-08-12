import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rateLimit";
import { notifyOrganization, getOrgContactInfo } from "@/lib/notifications";
import { sendEmail, emailTemplates } from "@/lib/email";

const bodySchema = z.object({ conversationId: z.string().uuid(), body: z.string().trim().min(1).max(4000) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`admin-message:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Message can't be empty." }, { status: 422 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { data: conversation } = await supabase
    .from("conversations")
    .select("organization_id")
    .eq("id", parsed.data.conversationId)
    .maybeSingle();

  const { error } = await supabase.from("messages").insert({
    conversation_id: parsed.data.conversationId,
    sender_id: user.id,
    body: parsed.data.body,
  });

  if (error) {
    console.error("Failed to insert admin message", error);
    return NextResponse.json({ ok: false, error: "Could not send message." }, { status: 500 });
  }

  if (conversation) {
    await notifyOrganization({
      organizationId: conversation.organization_id,
      type: "new_message",
      title: "New message from your account team",
      linkUrl: "/portal/messages/",
    });
    const contact = await getOrgContactInfo(conversation.organization_id);
    if (contact?.email) {
      await sendEmail({
        to: contact.email,
        subject: "New message from Acendia",
        html: emailTemplates.newMessage(contact.orgName),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
