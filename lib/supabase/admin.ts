// Admin Supabase client — uses the SERVICE ROLE KEY, which bypasses RLS
// entirely. Import this ONLY in webhook handlers, admin-only Route
// Handlers, and trusted server-side jobs that have already done their own
// authorization check. The `server-only` import makes it a build error to
// ever import this file into client-shipped code.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let cachedClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createAdminClient() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — the admin client cannot be created. Set these in .env.local / Vercel project settings."
    );
  }

  cachedClient = createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedClient;
}
