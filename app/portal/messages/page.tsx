import type { Metadata } from "next";
import Card from "@/components/Card";
import MessageForm from "@/components/portal/MessageForm";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Messages",
  description: "Messages with your Acendia account team.",
  path: "/portal/messages/",
  noIndex: true,
});

export default async function MessagesPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let messages: { id: string; sender_id: string; body: string; created_at: string }[] = [];
  if (conversation) {
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });
    messages = data ?? [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Messages</h1>
      <p className="mt-1 text-sm text-white/50">Direct line to your account team.</p>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <Card>
            <p className="text-sm text-white/60">
              No messages yet. Send one below and your account team will respond here.
            </p>
          </Card>
        )}
        {messages.map((m) => {
          const isMe = m.sender_id === ctx.user.id;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[var(--r-md)] border p-3 text-sm ${
                  isMe ? "border-white/20 bg-white/10 text-white" : "border-[var(--border)] bg-[var(--card)] text-white/80"
                }`}
              >
                <p>{m.body}</p>
                <p className="mt-1 text-[11px] text-white/30">
                  {new Date(m.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageForm />
    </div>
  );
}
