// Shared by the browser client, server client, and proxy.ts — all three
// must scope Supabase's session cookies identically, or a session set on
// one host (e.g. www.acendia.us) simply doesn't exist on another host of
// the same site (e.g. acendia.us, no www). Cookies are host-scoped by
// default; a leading-dot domain (".acendia.us") makes a cookie valid for
// the apex AND every subdomain, closing that gap entirely.
//
// Found live: a user's session was set on www.acendia.us, but the browser
// ended up rendering /checkout/ on the bare apex domain (acendia.us) —
// DevTools confirmed the auth cookie only existed under www, so the apex
// request genuinely had zero cookies and looked exactly like a sign-out.
//
// Returns undefined for anything that isn't production acendia.us (e.g.
// localhost, a Vercel preview URL) — those hosts don't support a
// leading-dot domain and don't have this apex/www split to begin with, so
// the default host-only cookie behavior is correct there.
export function getCookieDomain(hostname: string | null | undefined): string | undefined {
  if (!hostname) return undefined;
  const normalized = hostname.replace(/^www\./, "").split(":")[0];
  return normalized === "acendia.us" ? ".acendia.us" : undefined;
}
