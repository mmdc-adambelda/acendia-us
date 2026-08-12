"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/", label: "Dashboard" },
  { href: "/admin/clients/", label: "Clients" },
  { href: "/admin/projects/", label: "Projects" },
  { href: "/admin/tasks/", label: "Tasks" },
  { href: "/admin/reports/", label: "Reports" },
  { href: "/admin/payments/", label: "Payments" },
  { href: "/admin/subscriptions/", label: "Subscriptions" },
  { href: "/admin/messages/", label: "Messages" },
  { href: "/admin/plans/", label: "Plans" },
  { href: "/admin/activity/", label: "Activity Log" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
      {LINKS.map((link) => {
        const active = link.href === "/admin/" ? pathname === link.href : pathname?.startsWith(link.href);
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
