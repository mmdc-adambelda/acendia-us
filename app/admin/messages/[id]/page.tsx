import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminMessageForm from "@/components/admin/AdminMessageForm";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Conversation",
  description: "Client conversation.",
  path: "/admin/messages/",
  noIndex: true,
});

export default async function AdminConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAdminContext();
  const { id } = await params;
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, organization_id, subject")
    .eq("id", id)
    .maybeSingle();
  if (!conversation) notFound();

  const { data: org } = await supabase.from("organizations").select("name").eq("id", conversation.organization_id).maybeSingle();
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">{org?.name ?? "Conversation"}</h1>

      <div className="mt-6 space-y-3">
        {(messages ?? []).map((m) => {
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
        {(!messages || messages.length === 0) && <p className="text-sm text-white/50">No messages yet.</p>}
      </div>

      <AdminMessageForm conversationId={id} />
    </div>
  );
}
