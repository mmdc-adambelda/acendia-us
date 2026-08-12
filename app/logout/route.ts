import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Sign out failed (Supabase may not be configured)", err);
  }
  return NextResponse.redirect(new URL("/login/", req.url));
}
