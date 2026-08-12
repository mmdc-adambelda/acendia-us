import type { Metadata } from "next";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Acendia internal administration.",
  path: "/admin/",
  noIndex: true,
});

// Full admin console (client management, plan management, activity log,
// MRR/subscription overview) is Phase 4 — see
// CLIENT-PORTAL-IMPLEMENTATION.md. This stub is real role-gated
// infrastructure (staff/admin/super_admin only, enforced server-side via
// requireRole — not a hidden UI element) proving the access-control layer
// works end to end.
export default async function AdminPage() {
  const { profile } = await requireRole(["staff", "admin", "super_admin"]);

  return (
    <div className="min-h-screen bg-[var(--off-black)] py-14 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Acendia Admin</h1>
        <p className="mt-2 text-white/60">
          Signed in as {profile?.first_name ?? "staff"} · role: {profile?.role}
        </p>

        <Card className="mt-8">
          <h2 className="text-lg font-semibold text-white">Client and subscription management is coming next</h2>
          <p className="mt-3 text-sm text-white/60">
            Client list, plan configuration, subscription/payment oversight, task and report publishing, and the
            activity log land in the next phase. This page confirms the role-based access system is working — only
            staff, admin, and super_admin accounts can reach it, enforced server-side.
          </p>
        </Card>
      </Container>
    </div>
  );
}
