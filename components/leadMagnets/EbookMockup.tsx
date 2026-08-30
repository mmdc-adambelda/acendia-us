import { BookOpen } from "lucide-react";

/**
 * Code-generated ebook cover mockup — no AI-generated cover art asset
 * exists (or was requested), so this renders instantly from the site's
 * existing brand tokens (--accent gradient, --card, --border-hi) rather
 * than shipping a placeholder photo. Swapping in a real designed cover
 * later is a drop-in <Image> replacement, no component changes needed.
 */
export default function EbookMockup({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Stacked "pages" edge, offset behind the cover for a subtle depth effect */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[var(--r-md)] bg-white/10" />
      <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-[var(--r-md)] bg-white/15" />

      <div
        className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[var(--r-md)] border border-[var(--border-hi)] p-6 shadow-[var(--shadow-dark)]"
        style={{ background: "linear-gradient(145deg, var(--accent) 0%, var(--accent-2) 55%, var(--accent-3) 100%)" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(255,255,255,0.35),transparent_55%)]"
        />
        <div className="relative flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">A</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">Acendia Guide</span>
        </div>
        <div className="relative">
          <BookOpen className="mb-4 h-8 w-8 text-white/70" strokeWidth={1.5} />
          <p className="text-balance text-lg font-semibold leading-snug text-white sm:text-xl">{title}</p>
        </div>
      </div>
    </div>
  );
}
