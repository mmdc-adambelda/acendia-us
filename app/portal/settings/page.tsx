import type { Metadata } from "next";
import Card from "@/components/Card";
import SettingsForm from "@/components/portal/SettingsForm";
import { buildMetadata } from "@/lib/seo";
import { getPortalContext } from "@/lib/portal";

export const metadata: Metadata = buildMetadata({
  title: "Settings",
  description: "Manage your Acendia account settings.",
  path: "/portal/settings/",
  noIndex: true,
});

export default async function SettingsPage() {
  const ctx = await getPortalContext();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Account & Business Info</h2>
        <div className="mt-4">
          <SettingsForm
            initialFirstName={ctx.profile?.first_name ?? ""}
            initialLastName={ctx.profile?.last_name ?? ""}
            initialPhone={ctx.profile?.phone ?? ""}
            initialOrgName={ctx.orgName}
          />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-sm font-medium text-white/50">Email</h2>
        <p className="mt-2 text-sm text-white">{ctx.user.email}</p>
        <p className="mt-1 text-xs text-white/40">
          To change your email or password, use the{" "}
          <a href="/forgot-password/" className="underline hover:text-white">
            password reset flow
          </a>
          .
        </p>
      </Card>
    </div>
  );
}
