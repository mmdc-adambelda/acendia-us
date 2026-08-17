// Browser-side Supabase client. Only ever uses the anon key (safe for the
// client bundle) — never the service role key. RLS policies are what
// actually protect data here, not this file.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getCookieDomain } from "./cookieDomain";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Scope the session cookie to the whole domain (apex + www), not just
      // whichever host the browser happens to be on when signing in — see
      // cookieDomain.ts for why this matters.
      cookieOptions: { domain: getCookieDomain(typeof window !== "undefined" ? window.location.hostname : undefined) },
    }
  );
}
