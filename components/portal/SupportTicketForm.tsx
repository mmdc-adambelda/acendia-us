"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["General Question", "Billing", "Technical Issue", "Campaign Request", "Other"];

export default function SupportTicketForm() {
  const router = useRouter();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, description }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not submit. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubject("");
      setDescription("");
      setSuccess(true);
      setSubmitting(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-2.5 text-sm text-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-black">
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-2.5 text-sm text-white placeholder:text-white/30"
          placeholder="Brief summary"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="focus-ring w-full resize-none rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-2.5 text-sm text-white placeholder:text-white/30"
          placeholder="Tell us what's going on"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-emerald-300">Ticket submitted — we'll follow up shortly.</p>}
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Ticket"}
      </button>
    </form>
  );
}
