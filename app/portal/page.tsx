import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Card from "@/components/Card";
import { buildMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Client Portal",
  description: "Your Acendia client portal.",
  path: "/portal/",
  noIndex: true,
});

// Full dashboard (campaign health, SEO performance, tasks, reports, files,
// messages, billing, settings) is Phase 3 — see
// CLIENT-PORTAL-IMPLEMENTATION.md. This is a real, auth-gated landing page
// so the account a client just created has somewhere legitimate to land,
// rather than a dead link.
export default async function PortalPage() {
  const { profile } = await requireAuth();
  const supabase = await createClient();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .limit(1)
    .maybeSingle();

  let orgName: string | undefined;
  if (membership?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", membership.organization_id)
      .maybeSingle();
    orgName = org?.name;
  }

  return (
    <div className="min-h-screen py-14 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Welcome back, {profile?.first_name ?? "there"}
        </h1>
        {orgName && <p className="mt-2 text-white/60">{orgName}</p>}

        <Card className="mt-8">
          <h2 className="text-lg font-semibold text-white">Your full dashboard is on its way</h2>
          <p className="mt-3 text-sm text-white/60">
            Campaign progress, SEO performance, tasks, reports, billing, and messaging are being built out next. In
            the meantime, your account and business information are saved and your account team has everything they
            need to get started.
          </p>
        </Card>

        <p className="mt-8 text-sm text-white/40">
          Need something now?{" "}
          <Link href="/contact/" className="underline hover:text-white">
            Contact your account team
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
