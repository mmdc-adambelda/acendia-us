"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link_url: string | null;
  read_at: string | null;
  created_at: string;
};

export default function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function markAllRead() {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/portal/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      router.refresh();
    } catch {
      // silent — this is a convenience action, not critical
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring relative flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/5 hover:text-white"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-white/50">Notifications</span>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="focus-ring text-xs text-white/40 hover:text-white">
                  Mark all read
                </button>
              )}
            </div>
            <div className="mt-1 max-h-80 overflow-y-auto">
              {notifications.length === 0 && <p className="px-2 py-4 text-center text-sm text-white/40">No notifications yet.</p>}
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link_url ?? "#"}
                  onClick={() => setOpen(false)}
                  className={`focus-ring block rounded-[var(--r-sm)] px-2 py-2 text-sm transition-colors hover:bg-white/5 ${
                    n.read_at ? "text-white/50" : "text-white"
                  }`}
                >
                  <span className="block font-medium">{n.title}</span>
                  {n.body && <span className="block text-xs text-white/40">{n.body}</span>}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
