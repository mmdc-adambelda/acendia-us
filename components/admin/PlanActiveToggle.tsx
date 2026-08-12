"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanActiveToggle({ planId, isActive }: { planId: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plans/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, isActive: !isActive }),
      });
      const data = await res.json();
      if (res.ok && data.ok) router.refresh();
      else alert(data.error ?? "Could not update plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="focus-ring rounded-[var(--r-sm)] border border-[var(--border-hi)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/5 disabled:opacity-50"
    >
      {loading ? "Saving…" : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
