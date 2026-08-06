import {
  Search,
  MapPin,
  Cpu,
  BadgeCheck,
  LayoutGrid,
  Code2,
  FileText,
  Target,
  TrendingUp,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  "map-pin": MapPin,
  cpu: Cpu,
  "badge-check": BadgeCheck,
  layout: LayoutGrid,
  code: Code2,
  "file-text": FileText,
  target: Target,
  "trending-up": TrendingUp,
  layers: Layers,
  sparkles: Sparkles,
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}

// Lucide doesn't ship brand/logo glyphs, so these are hand-built minimal
// outline marks for the three social platforms we link to in the footer.
export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 9h2.5V6h-2.5c-1.93 0-3.5 1.57-3.5 3.5V12H8v3h2.5v6h3v-6h2.35l.65-3h-3V9.5c0-.28.22-.5.5-.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.2" cy="9" r="1" fill="currentColor" />
      <path d="M8.2 11.2v5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11.6 16.5v-3.1c0-1.15.75-2.1 2-2.1s2 .9 2 2.1v3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.6 16.5v-5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
