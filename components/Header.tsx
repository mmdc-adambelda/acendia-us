"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteSwitcher from "./SiteSwitcher";
import ServicesMenu from "./ServicesMenu";
import { ServiceIcon } from "./icons";
import { NAV_LINKS, CORE_SERVICES_MENU } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-dim)] bg-[var(--off-black)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-2" aria-label="Acendia home">
          <Image
            src="/brand/acendia-logo.png"
            alt="Acendia"
            width={120}
            height={38}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.label === "Services" ? (
              <ServicesMenu key={link.href} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring text-sm font-medium text-white/75 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SiteSwitcher />
          <Link
            href="/login/"
            className="focus-ring text-sm font-medium text-white/70 hover:text-white"
          >
            Client Login
          </Link>
          <Link
            href="/free-seo-audit/"
            data-event="audit_cta_clicked"
            className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)]"
          >
            Get Your Free SEO Audit
          </Link>
        </div>

        <button
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-[var(--r-sm)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-[var(--border-dim)] px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.label === "Services" ? (
                <li key={link.href}>
                  <button
                    type="button"
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-services-submenu"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="focus-ring flex w-full items-center justify-between rounded-[var(--r-sm)] px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                  >
                    Services
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileServicesOpen && (
                    <ul id="mobile-services-submenu" className="ml-3 mt-1 space-y-1 border-l border-[var(--border-dim)] pl-3">
                      {CORE_SERVICES_MENU.map((service) => (
                        <li key={service.href}>
                          <Link
                            href={service.href}
                            onClick={() => setOpen(false)}
                            className="focus-ring flex items-center gap-2.5 rounded-[var(--r-sm)] px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                          >
                            <ServiceIcon name={service.icon} className="h-4 w-4 shrink-0" />
                            {service.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/services/"
                          onClick={() => setOpen(false)}
                          className="focus-ring block rounded-[var(--r-sm)] px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white"
                        >
                          View all services →
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring block rounded-[var(--r-sm)] px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
            <li className="mt-2">
              <Link
                href="/free-seo-audit/"
                onClick={() => setOpen(false)}
                data-event="audit_cta_clicked"
                className="focus-ring block rounded-[var(--r-sm)] bg-white px-3 py-3 text-center text-base font-semibold text-black"
              >
                Get Your Free SEO Audit
              </Link>
            </li>
            <li>
              <Link
                href="/login/"
                onClick={() => setOpen(false)}
                className="focus-ring block rounded-[var(--r-sm)] border border-[var(--border)] px-3 py-3 text-center text-base font-medium text-white/80"
              >
                Client Login
              </Link>
            </li>
          </ul>
          <div className="mt-4 border-t border-[var(--border-dim)] pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wide text-white/40">
              Other Acendia sites
            </p>
            <div className="mt-2">
              <SiteSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
