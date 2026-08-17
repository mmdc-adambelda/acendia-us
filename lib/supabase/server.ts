// Server-side Supabase client for Server Components, Server Actions, and
// Route Handlers. Uses the anon key + the caller's session cookie — RLS
// still applies. This is NOT the admin client; see admin.ts for that.
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { Database } from "./database.types";
import { getCookieDomain } from "./cookieDomain";

export async function createClient() {
  const cookieStore = await cookies();
  const host = (await headers()).get("host");

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Same host-scoping fix as the browser client — see cookieDomain.ts.
      cookieOptions: { domain: getCookieDomain(host) },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies —
            // safe to ignore because middleware.ts refreshes the session
            // on every request anyway.
          }
        },
      },
    }
  );
}
