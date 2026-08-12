"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageForm({ endpoint = "/api/portal/messages" }: { endpoint?: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send. Please try again.");
        setSending(false);
        return;
      }
      setBody("");
      setSending(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a message to your account team…"
        className="focus-ring w-full resize-none rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-3 text-sm text-white placeholder:text-white/30"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={sending || !body.trim()}
        className="focus-ring mt-2 inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
