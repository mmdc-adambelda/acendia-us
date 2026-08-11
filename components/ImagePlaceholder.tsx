import { ServiceIcon } from "./icons";

/**
 * Code-generated stand-in for a page's hero image — no AI generation
 * credits needed, renders instantly, and matches the site's black/white
 * brand system. Used wherever a real photo hasn't been generated/uploaded
 * yet (see IMAGE_INVENTORY.md for the full replacement list). Swapping in
 * a real image later is just adding a `heroImage`/`image` value in the
 * content data — no component changes needed.
 */
export default function ImagePlaceholder({
  icon = "sparkles",
  aspectClass = "aspect-[8/5]",
  className = "",
}: {
  icon?: string;
  aspectClass?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-grid relative flex ${aspectClass} items-center justify-center overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.10),transparent_65%)]" />
      <ServiceIcon name={icon} className="relative h-12 w-12 text-white/20 sm:h-16 sm:w-16" />
    </div>
  );
}
