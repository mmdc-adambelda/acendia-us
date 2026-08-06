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
