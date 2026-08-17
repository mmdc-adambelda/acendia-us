"use client";

import { useState } from "react";
import Card from "@/components/Card";

type Item = { id: string; label: string; description: string | null };

export default function OnboardingChecklist({
  items,
  initialCompletedIds,
}: {
  items: Item[];
  initialCompletedIds: string[];
}) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompletedIds));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(itemId: string) {
    const next = !completed.has(itemId);
    setError(null);
    setPendingId(itemId);
    setCompleted((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(itemId);
      else copy.delete(itemId);
      return copy;
    });

    try {
      const res = await fetch("/api/onboarding/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, completed: next }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Could not save.");
    } catch (err) {
      // Roll back the optimistic update on failure.
      setCompleted((prev) => {
        const copy = new Set(prev);
        if (next) copy.delete(itemId);
        else copy.add(itemId);
        return copy;
      });
      setError(err instanceof Error ? err.message : "Could not save. Please try again.");
    } finally {
      setPendingId(null);
    }
  }

  const total = items.length;
  const doneCount = items.filter((i) => completed.has(i.id)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-white/60">
        <span>
          {doneCount} of {total} complete
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <ul className="mt-8 space-y-3">
        {items.map((item) => {
          const done = completed.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                disabled={pendingId === item.id}
                aria-pressed={done}
                className="focus-ring block w-full text-left disabled:opacity-70"
              >
                <Card className="flex items-start gap-3 p-4 hover:border-[var(--border-hi)]">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                      done ? "border-white bg-white text-black" : "border-[var(--border-hi)] text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${done ? "text-white/50 line-through" : "text-white"}`}>
                      {item.label}
                    </p>
                    {item.description && <p className="mt-0.5 text-xs text-white/45">{item.description}</p>}
                  </div>
                </Card>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
