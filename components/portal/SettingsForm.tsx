"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialFirstName: string;
  initialLastName: string;
  initialPhone: string;
  initialOrgName: string;
};

export default function SettingsForm({ initialFirstName, initialLastName, initialPhone, initialOrgName }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);
  const [organizationName, setOrganizationName] = useState(initialOrgName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/portal/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, organizationName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save your changes.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] p-2.5 text-sm text-white placeholder:text-white/30";

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
        <label className="mb-1 block text-xs font-medium text-white/50">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-white/50">Business Name</label>
        <input
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-emerald-300">Saved.</p>}
      <button
        type="submit"
        disabled={saving}
        className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
