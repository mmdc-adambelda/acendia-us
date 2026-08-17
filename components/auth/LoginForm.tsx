"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(
          signInError.message.toLowerCase().includes("email not confirmed")
            ? "Please verify your email before logging in — check your inbox for the confirmation link."
            : "Incorrect email or password."
        );
        return;
      }

      const next = searchParams.get("next") || "/portal/";
      // Hard navigation, not router.push() — a soft client-side navigation
      // can serve a page from Next.js's client router cache, which may
      // still hold an unauthenticated-redirect response from before this
      // sign-in if that page was ever visited/rendered while signed out.
      // Found live: this caused "log in, click Complete checkout, get
      // asked to log in again" loops that only resolved after enough
      // repeated attempts happened to invalidate the stale cache entry.
      // A full navigation guarantees a fresh server request that reads
      // the just-set session cookie, with no cache in the way.
      window.location.assign(next);
    } catch (err) {
      console.error("signIn failed", err);
      setError("We couldn't reach our servers. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p role="alert" className="rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-white/80">
            Password
          </label>
          <Link href="/forgot-password/" className="focus-ring text-xs text-white/50 hover:text-white">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring w-full rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60"
      >
        {submitting ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
