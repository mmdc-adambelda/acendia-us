import Card from "@/components/Card";

type Item = { id: string; label: string; description: string | null };

/**
 * Server Component — deliberately no client-side JS at all. Each item is
 * its own real HTML <form> that POSTs to /api/onboarding/toggle and gets a
 * real redirect back; the whole card is one submit button so it still
 * looks and behaves like a single click, but there's no fetch() in this
 * flow to have its cookies silently withheld by a browser/extension. See
 * app/api/checkout/create/route.ts for the fuller explanation of why this
 * app avoids fetch() for anything session-dependent.
 */
export default function OnboardingChecklist({
  items,
  completedIds,
  errorMessage,
}: {
  items: Item[];
  completedIds: string[];
  errorMessage: string | null;
}) {
  const completed = new Set(completedIds);
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

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      )}

      <ul className="mt-8 space-y-3">
        {items.map((item) => {
          const done = completed.has(item.id);
          return (
            <li key={item.id}>
              <form method="POST" action="/api/onboarding/toggle">
                <input type="hidden" name="itemId" value={item.id} />
                <input type="hidden" name="completed" value={done ? "false" : "true"} />
                <button type="submit" aria-pressed={done} className="focus-ring block w-full text-left">
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
              </form>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
