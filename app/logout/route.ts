import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Sign out failed (Supabase may not be configured)", err);
  }
  // ?next= lets a caller send someone straight back to a specific page's
  // login prompt after signing out — e.g. checkout/success/page.tsx uses
  // this to route "payment confirmed" into "please log in to continue
  // onboarding" instead of leaving the just-established registration
  // session open indefinitely. Only ever appended to /login/'s own
  // ?next=, never used to redirect anywhere outside this app.
  const next = req.nextUrl.searchParams.get("next");
  const loginUrl = new URL("/login/", req.url);
  if (next) loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
