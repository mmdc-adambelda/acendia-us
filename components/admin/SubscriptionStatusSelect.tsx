"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "trialing", "active", "past_due", "paused", "cancelled", "expired"];

export default function SubscriptionStatusSelect({ subscriptionId, status }: { subscriptionId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/subscriptions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setValue(status);
      } else {
        router.refresh();
      }
    } catch {
      setValue(status);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="focus-ring rounded-[var(--r-sm)] border border-[var(--border-hi)] bg-white/[0.02] px-2 py-1 text-xs text-white"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-black">
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
