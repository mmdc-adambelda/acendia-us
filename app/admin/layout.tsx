import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import AdminNav from "@/components/portal/AdminNav";
import { getAdminContext } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ctx = await getAdminContext();

  return (
    <div className="min-h-screen bg-grid">
      <div className="border-b border-[var(--border-dim)]">
        <Container className="flex items-center justify-between py-4">
          <Link href="/admin/" className="focus-ring flex items-center gap-2" aria-label="Acendia admin home">
            <Image src="/brand/acendia-logo.png" alt="Acendia" width={110} height={34} className="h-6 w-auto" />
            <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-medium text-white/50">
              Admin
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span className="hidden sm:inline">
              {ctx.profile?.first_name ?? "Staff"} · {ctx.profile?.role}
            </span>
            <Link href="/portal/" className="focus-ring hover:text-white">
              Client Portal
            </Link>
            <Link href="/logout/" className="focus-ring hover:text-white">
              Sign Out
            </Link>
          </div>
        </Container>
      </div>

      <Container className="flex flex-col gap-8 py-8 lg:flex-row lg:py-10">
        <aside className="shrink-0 lg:w-56">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1 pb-20">{children}</main>
      </Container>
    </div>
  );
}
