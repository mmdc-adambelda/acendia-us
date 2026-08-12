"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = { id: string; name: string };

export default function NewClientForm({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [planId, setPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ passwordSetLink: string | null } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, businessName, city, state, planId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create client.");
        setSubmitting(false);
        return;
      }
      setResult({ passwordSetLink: data.passwordSetLink });
      setSubmitting(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-2.5 text-sm text-white placeholder:text-white/30";

  if (result) {
    return (
      <div>
        <p className="text-sm text-emerald-300">Client created.</p>
        {result.passwordSetLink ? (
          <div className="mt-3">
            <p className="text-sm text-white/60">Send this link to the client so they can set their password:</p>
            <p className="mt-2 break-all rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-3 text-xs text-white/80">
              {result.passwordSetLink}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-white/60">
            Could not generate a password-set link automatically — use the Supabase Dashboard's "Send password
            recovery" for this user instead.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Business Name</label>
        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required className={inputClass} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-white/50">State</label>
          <input value={state} onChange={(e) => setState(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Plan (optional)</label>
        <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={inputClass}>
          <option value="" className="bg-black">
            No plan yet
          </option>
          {plans.map((p) => (
            <option key={p.id} value={p.id} className="bg-black">
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create Client"}
      </button>
    </form>
  );
}
