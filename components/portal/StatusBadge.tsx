const STYLES: Record<string, string> = {
  active: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  trialing: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  past_due: "bg-red-400/15 text-red-300 border-red-400/30",
  paused: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  cancelled: "bg-white/10 text-white/50 border-white/15",
  expired: "bg-white/10 text-white/50 border-white/15",
  on_track: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  needs_attention: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  waiting_for_client: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  reporting: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  completed: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  in_progress: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  planned: "bg-white/10 text-white/50 border-white/15",
  blocked: "bg-red-400/15 text-red-300 border-red-400/30",
  review: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  open: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  resolved: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  closed: "bg-white/10 text-white/50 border-white/15",
  paid: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  failed: "bg-red-400/15 text-red-300 border-red-400/30",
  refunded: "bg-white/10 text-white/50 border-white/15",
};

export function labelize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? "bg-white/10 text-white/50 border-white/15";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {labelize(status)}
    </span>
  );
}
