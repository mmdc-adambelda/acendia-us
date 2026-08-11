"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ServiceIcon } from "./icons";
import { CORE_SERVICES_MENU } from "@/lib/site";

export default function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    // Small delay so moving the mouse from the trigger to the panel
    // (across the gap between them) doesn't close it prematurely.
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href="/services/"
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-ring flex items-center gap-1 text-sm font-medium text-white/75 transition-colors hover:text-white"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        Services
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </Link>

      {open && (
        <div
          role="menu"
          aria-label="Core services"
          className="absolute left-1/2 top-full z-50 mt-3 w-[560px] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 overflow-hidden rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-dark)]"
        >
          <div className="grid grid-cols-2 gap-1 p-3">
            {CORE_SERVICES_MENU.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="focus-ring group flex items-start gap-3 rounded-[var(--r-sm)] p-3 transition-colors hover:bg-white/5"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--r-sm)] border border-[var(--border)] text-white/70 transition-colors group-hover:text-white">
                  <ServiceIcon name={service.icon} className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-white">{service.label}</span>
                  <span className="mt-0.5 block text-xs text-white/45">{service.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[var(--border-dim)] px-4 py-3">
            <Link
              href="/services/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="focus-ring text-sm font-medium text-white/70 hover:text-white"
            >
              View all services →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
