"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublishReportButton({ reportId, published }: { reportId: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, publish: !published }),
      });
      const data = await res.json();
      if (res.ok && data.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`focus-ring rounded-[var(--r-sm)] px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
        published ? "border border-[var(--border-hi)] text-white hover:bg-white/5" : "bg-white text-black hover:shadow-[var(--glow-white)]"
      }`}
    >
      {loading ? "Saving…" : published ? "Unpublish" : "Publish"}
    </button>
  );
}
