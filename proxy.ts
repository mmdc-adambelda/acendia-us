import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// NOTE: Next.js 16 renamed the `middleware.ts` file convention to
// `proxy.ts` (exported function renamed `middleware` -> `proxy`) —
// `middleware` is deprecated. See
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
// Functionally this is the same mechanism (runs before rendering, Node.js
// runtime by default as of v16 — no longer Edge-only).

// Paths that require a signed-in session. This is a UX convenience redirect
// only — the real authorization boundary is Postgres RLS (see
// supabase/migrations/0002_rls_policies.sql) plus explicit role checks in
// each Server Component/Route Handler. Never rely on this alone.
const PROTECTED_PREFIXES = ["/portal", "/admin", "/onboarding"];

// Every one of these must never appear in Google — client data lives
// behind them. Belt-and-suspenders alongside the per-page `noindex`
// metadata already set via buildMetadata({ noIndex: true }).
const NOINDEX_PREFIXES = [
  "/portal",
  "/admin",
  "/checkout",
  "/onboarding",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/get-started",
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Next.js Link prefetches every link that scrolls into view by default —
// including "Complete checkout" on the portal dashboard — which silently
// runs this proxy in the background before a user ever clicks. If that
// background prefetch and a genuine navigation both call
// supabase.auth.getUser() (which refreshes the session token) close
// together, Supabase's refresh-token rotation treats the second refresh as
// reuse and invalidates the WHOLE session — a real sign-out, not a UI
// glitch. Found live: clicking "Complete checkout" from an already-signed-
// in /portal genuinely logged the user out. Next.js marks prefetch
// requests with this header, so skip the refresh (and the redirect check
// that depends on it) for those — an actual click always fires a real,
// non-prefetch request that still gets checked normally.
function isPrefetchRequest(request: NextRequest): boolean {
  return (
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("sec-purpose") === "prefetch"
  );
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;

  // Proxy runs on almost every request in this app, including every
  // existing public marketing page — it must NEVER throw or 500 the whole
  // site just because Supabase isn't configured yet (e.g. before
  // NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are set in
  // Vercel). If the env vars are missing, skip auth entirely rather than
  // calling createServerClient with empty strings (which throws). The
  // noindex header below doesn't depend on Supabase, so it still applies.
  if (SUPABASE_URL && SUPABASE_ANON_KEY && !isPrefetchRequest(request)) {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refreshes the session cookie if needed — must be called on every
    // request that touches an authenticated route, per Supabase's SSR docs.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (PROTECTED_PREFIXES.some((p) => path.startsWith(p)) && !user) {
      const redirectUrl = new URL("/login/", request.url);
      redirectUrl.searchParams.set("next", path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (NOINDEX_PREFIXES.some((p) => path.startsWith(p))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and image optimization
     * requests, which don't need a session refresh or noindex header.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|brand/|images/).*)",
  ],
};
