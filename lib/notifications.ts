import "server-only";
import { createAdminClient } from "./supabase/admin";

/**
 * In-app notification + optional email, for a specific user. Notifications
 * are always written via the admin (service role) client — the RLS
 * `notifications_insert_staff` policy intentionally blocks clients from
 * writing their own notification rows (would let a client fake system
 * events), so system-triggered notifications must go through here rather
 * than the caller's session client.
 */
export async function notifyUser(params: {
  userId: string;
  organizationId?: string | null;
  type: string;
  title: string;
  body?: string;
  linkUrl?: string;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert({
      user_id: params.userId,
      organization_id: params.organizationId ?? null,
      type: params.type,
      title: params.title,
      body: params.body ?? null,
      link_url: params.linkUrl ?? null,
    });
  } catch (err) {
    console.error("notifyUser failed", err);
  }
}

/** Looks up the owning organization member's email and the org's display name — for emails triggered by webhooks/admin actions that only have an organizationId to work from. */
export async function getOrgContactInfo(
  organizationId: string,
): Promise<{ email: string | null; orgName: string } | null> {
  try {
    const admin = createAdminClient();
    const [{ data: org }, { data: owner }] = await Promise.all([
      admin.from("organizations").select("name").eq("id", organizationId).maybeSingle(),
      admin
        .from("organization_members")
        .select("user_id")
        .eq("organization_id", organizationId)
        .eq("role", "owner")
        .limit(1)
        .maybeSingle(),
    ]);
    if (!org) return null;
    let email: string | null = null;
    if (owner?.user_id) {
      const { data: userResult } = await admin.auth.admin.getUserById(owner.user_id);
      email = userResult?.user?.email ?? null;
    }
    return { email, orgName: org.name };
  } catch (err) {
    console.error("getOrgContactInfo failed", err);
    return null;
  }
}

/** Notifies every member of an organization (owner + any additional members). */
export async function notifyOrganization(params: {
  organizationId: string;
  type: string;
  title: string;
  body?: string;
  linkUrl?: string;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: members } = await admin
      .from("organization_members")
      .select("user_id")
      .eq("organization_id", params.organizationId);
    await Promise.all(
      (members ?? []).map((m) =>
        notifyUser({
          userId: m.user_id,
          organizationId: params.organizationId,
          type: params.type,
          title: params.title,
          body: params.body,
          linkUrl: params.linkUrl,
        }),
      ),
    );
  } catch (err) {
    console.error("notifyOrganization failed", err);
  }
}
