import "server-only";
import { cache } from "react";
import { requireRole } from "./auth";

export const STAFF_ROLES = ["staff", "admin", "super_admin"] as const;
export const ADMIN_ROLES = ["admin", "super_admin"] as const;

/**
 * Shared context for every /admin/* page — enforces staff-or-above access
 * server-side (RLS is the real boundary underneath, this is the UX layer).
 * Cached per-request so layout + page don't double the auth round trip.
 */
export const getAdminContext = cache(async function getAdminContext() {
  const { user, profile } = await requireRole([...STAFF_ROLES]);
  return { user, profile };
});
