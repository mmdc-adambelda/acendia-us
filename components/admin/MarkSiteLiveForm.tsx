"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkSiteLiveForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [goLiveDate, setGoLiveDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ billingStart: string; providerNote: string | null } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/subscriptions/mark-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId, goLiveDate }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save go-live date.");
        setSubmitting(false);
        return;
      }
      setResult({ billingStart: data.billingStart, providerNote: data.providerNote });
      setSubmitting(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-[var(--r-sm)] border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm">
        <p className="text-emerald-200">
          Site marked live. Monthly billing scheduled for {new Date(result.billingStart).toDateString()}.
        </p>
        {result.providerNote && <p className="mt-2 text-xs text-white/50">{result.providerNote}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Real go-live date</label>
        <input
          type="date"
          value={goLiveDate}
          onChange={(e) => setGoLiveDate(e.target.value)}
          required
          className="focus-ring rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] px-3 py-2 text-sm text-white"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring rounded-[var(--r-sm)] bg-white px-4 py-2 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Mark Site Live"}
      </button>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </form>
  );
}
