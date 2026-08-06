"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

type SiteOption = {
  code: string;
  label: string;
  flag: string;
  href: string;
  current?: boolean;
};

// Acendia's other country sites. AU intentionally points to acendia.uk,
// which serves both the UK and Australia per Acendia's current site split.
const SITE_OPTIONS: SiteOption[] = [
  { code: "US", label: "United States", flag: "🇺🇸", href: "https://acendia.us", current: true },
  { code: "UK", label: "United Kingdom", flag: "🇬🇧", href: "https://acendia.uk" },
  { code: "AU", label: "Australia", flag: "🇦🇺", href: "https://acendia.uk" },
  { code: "NZ", label: "New Zealand", flag: "🇳🇿", href: "https://acendia.agency" },
];

export default function SiteSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const current = SITE_OPTIONS.find((o) => o.current)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-ring flex h-10 items-center gap-1.5 rounded-[var(--r-sm)] border border-[var(--border)] px-3 text-sm text-white/75 transition-colors hover:border-[var(--border-hi)] hover:text-white"
      >
        <Globe className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        <span aria-hidden="true">{current.flag}</span>
        <span className="hidden sm:inline">{current.code}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose your region"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-dark)]"
        >
          {SITE_OPTIONS.map((option) => (
            <a
              key={option.code}
              href={option.href}
              role="menuitem"
              target={option.current ? undefined : "_blank"}
              rel={option.current ? undefined : "noopener noreferrer"}
              onClick={() => setOpen(false)}
              className={`focus-ring flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
                option.current ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {option.flag}
              </span>
              <span className="flex-1">{option.label}</span>
              {option.current && <span className="text-xs text-white/40">Current</span>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
