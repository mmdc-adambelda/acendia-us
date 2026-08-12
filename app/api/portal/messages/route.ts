import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rateLimit";
import { sendEmail, emailTemplates, getAdminNotificationEmail } from "@/lib/email";

const bodySchema = z.object({ body: z.string().trim().min(1).max(4000) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(`portal-message:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Message can't be empty." }, { status: 422 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Please log in." }, { status: 401 });

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) return NextResponse.json({ ok: false, error: "No account found." }, { status: 404 });

  let { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!conversation) {
    const { data: newConv, error: convError } = await supabase
      .from("conversations")
      .insert({ organization_id: membership.organization_id, subject: "General" })
      .select("id")
      .single();
    if (convError || !newConv) {
      console.error("Failed to create conversation", convError);
      return NextResponse.json({ ok: false, error: "Could not send message." }, { status: 500 });
    }
    conversation = newConv;
  }

  const { error: msgError } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    sender_id: user.id,
    body: parsed.data.body,
  });

  if (msgError) {
    console.error("Failed to insert message", msgError);
    return NextResponse.json({ ok: false, error: "Could not send message." }, { status: 500 });
  }

  const adminEmail = getAdminNotificationEmail();
  if (adminEmail) {
    const { data: org } = await supabase.from("organizations").select("name").eq("id", membership.organization_id).maybeSingle();
    await sendEmail({
      to: adminEmail,
      subject: `New client message: ${org?.name ?? "a client"}`,
      html: emailTemplates.adminNewClientMessage(org?.name ?? "A client"),
    });
  }

  return NextResponse.json({ ok: true });
}
