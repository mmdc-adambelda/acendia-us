import type { Metadata } from "next";
import Card from "@/components/Card";
import StatusBadge from "@/components/portal/StatusBadge";
import SupportTicketForm from "@/components/portal/SupportTicketForm";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "Support",
  description: "Get help from your Acendia account team.",
  path: "/portal/support/",
  noIndex: true,
});

export default async function SupportPage() {
  const ctx = await getPortalContext();
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, category, subject, status, created_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Support</h1>

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Submit a Ticket</h2>
        <div className="mt-3">
          <SupportTicketForm />
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-white/50">Your Tickets</h2>
        <div className="mt-3 space-y-2">
          {(!tickets || tickets.length === 0) && (
            <Card>
              <p className="text-sm text-white/60">No support tickets yet.</p>
            </Card>
          )}
          {tickets?.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-white">{t.subject}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="mt-1 text-xs text-white/40">
                {t.category} · {new Date(t.created_at).toLocaleDateString("en-US")}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
