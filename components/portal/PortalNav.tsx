"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/portal/", label: "Dashboard" },
  { href: "/portal/campaign/", label: "Campaign" },
  { href: "/portal/seo/", label: "SEO Performance" },
  { href: "/portal/tasks/", label: "Tasks" },
  { href: "/portal/reports/", label: "Reports" },
  { href: "/portal/files/", label: "Files" },
  { href: "/portal/messages/", label: "Messages" },
  { href: "/portal/billing/", label: "Billing" },
  { href: "/portal/support/", label: "Support" },
  { href: "/portal/settings/", label: "Settings" },
];

export default function PortalNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {LINKS.map((link) => {
        const active = link.href === "/portal/" ? pathname === link.href : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`focus-ring shrink-0 rounded-[var(--r-sm)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors lg:whitespace-normal ${
              active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
