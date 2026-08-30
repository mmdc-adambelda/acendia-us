import Image from "next/image";
import { BookOpen } from "lucide-react";

/**
 * Ebook cover visual. Renders the real designed cover (lib/leadMagnets.ts's
 * `coverImage`) when one exists — it already carries its own shadow/depth,
 * so it's rendered plain, no extra wrapper effects. Falls back to a
 * code-generated placeholder (brand-token gradient + title text) for any
 * future lead magnet that doesn't have a real cover yet, so this
 * component never needs to change when one is added later — just set
 * `coverImage` in that magnet's config.
 */
export default function EbookMockup({
  title,
  coverImage,
  className = "",
}: {
  title: string;
  coverImage?: { src: string; alt: string };
  className?: string;
}) {
  if (coverImage) {
    return (
      <div className={`ebook-cover-tilt relative aspect-[3/4] overflow-hidden ${className}`}>
        <Image
          src={coverImage.src}
          alt={coverImage.alt}
          fill
          sizes="(min-width: 1024px) 320px, 280px"
          className="object-contain"
          priority
        />
        {/* Looping glossy sweep — mix-blend-mode: overlay so it reads as a
            light reflection across the cover, not a flat white bar. */}
        <span aria-hidden="true" className="ebook-cover-shine pointer-events-none" />
      </div>
    );
  }

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
