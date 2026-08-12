import type { Metadata } from "next";
import Card from "@/components/Card";
import NewClientForm from "@/components/admin/NewClientForm";
import { buildMetadata } from "@/lib/seo";
import { getAdminContext } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = buildMetadata({
  title: "New Client",
  description: "Manually create an Acendia client.",
  path: "/admin/clients/new/",
  noIndex: true,
});

export default async function NewClientPage() {
  await getAdminContext();
  const supabase = await createClient();
  const { data: plans } = await supabase.from("plans").select("id, name").eq("is_active", true).order("display_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">New Client</h1>
      <p className="mt-1 text-sm text-white/50">Creates a real login, business record, and (optionally) a pending plan.</p>
      <Card className="mt-6 max-w-lg">
        <NewClientForm plans={plans ?? []} />
      </Card>
    </div>
  );
}
