"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Handles the confirmation link Supabase emails after signUp(). That link
 * lands here carrying either a PKCE `?code=` or (older-style) `#access_
 * token=` fragment. The browser Supabase client auto-detects and exchanges
 * either one for a real session on init (detectSessionInUrl, on by
 * default) — this component just needs to exist on the page and listen
 * for that to happen, then send the person straight into their account
 * instead of leaving them on a static "check your inbox" page after
 * they've already verified.
 *
 * Renders nothing visible on success (the redirect happens before there's
 * anything to show); the parent page's static "check your inbox" content
 * stays as the fallback for anyone who lands here without a valid link
 * (e.g. navigating here directly, or a link opened on a different device
 * than the one that started registration — PKCE's code_verifier is device-
 * local, so cross-device confirmation can't complete a session here; that
 * case falls through to the timeout below with an honest message instead
 * of a stuck spinner).
 */
function hasAuthParamsInUrl(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.search.includes("code=") || window.location.hash.includes("access_token=");
}

export default function VerifyEmailHandler() {
  const router = useRouter();
  // Lazy initializer reads the URL once, synchronously, before the first
  // render — no effect needed just to decide "checking" vs "idle", which
  // avoids calling setState from inside an effect body for that branch.
  const [status, setStatus] = useState<"checking" | "success" | "idle" | "failed">(() =>
    hasAuthParamsInUrl() ? "checking" : "idle"
  );

  useEffect(() => {
    if (status !== "checking") return;

    const supabase = createClient();
    let redirected = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!redirected && event === "SIGNED_IN" && session) {
        redirected = true;
        setStatus("success");
        router.replace("/portal/");
      }
    });

    // Covers the case where the session was already established
    // synchronously before the listener above attached.
    supabase.auth.getSession().then(({ data }) => {
      if (!redirected && data.session) {
        redirected = true;
        setStatus("success");
        router.replace("/portal/");
      }
    });

    // If nothing has happened after a few seconds, this link's session
    // exchange genuinely failed (most likely opened on a different device
    // than registration started on) — stop showing a spinner and tell the
    // person honestly what to do instead.
    const timeout = setTimeout(() => {
      if (!redirected) setStatus("failed");
    }, 6000);

    return () => {
      subscription.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, status]);

  if (status === "idle") return null;

  if (status === "failed") {
    return (
      <p className="mt-6 rounded-[var(--r-sm)] border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
        Your email looks verified, but we couldn&apos;t sign you in automatically here — this can happen if you
        opened this link on a different device or browser than the one you registered with. Please log in below.
      </p>
    );
  }

  return (
    <p className="mt-6 text-sm text-white/50">
      {status === "success" ? "Verified — taking you to your account…" : "Verifying your email…"}
    </p>
  );
}
