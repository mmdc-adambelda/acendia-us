import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import PortalNav from "@/components/portal/PortalNav";
import NotificationBell from "@/components/portal/NotificationBell";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const ctx = await getPortalContext();
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, body, link_url, read_at, created_at")
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-grid">
      <div className="border-b border-[var(--border-dim)]">
        <Container className="flex items-center justify-between py-4">
          <Link href="/portal/" className="focus-ring flex items-center gap-2" aria-label="Acendia portal home">
            <Image src="/brand/acendia-logo.png" alt="Acendia" width={110} height={34} className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="hidden sm:inline">{ctx.orgName}</span>
            <NotificationBell notifications={notifications ?? []} />
            <Link href="/" className="focus-ring hover:text-white">
              Main Site
            </Link>
            <Link href="/logout/" className="focus-ring hover:text-white">
              Sign Out
            </Link>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-8 py-8 lg:flex-row lg:py-10">
        <aside className="shrink-0 lg:w-56">
          <PortalNav />
        </aside>
        <main className="min-w-0 flex-1 pb-20">{children}</main>
      </Container>
    </div>
  );
}
