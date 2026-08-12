"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/`,
      });

      // Always show the same success state regardless of whether the email
      // exists — prevents using this form to enumerate registered accounts.
      if (resetError) {
        setError("Something went wrong. Please try again in a moment.");
        return;
      }
      setSent(true);
    } catch (err) {
      console.error("resetPasswordForEmail failed", err);
      setError("We couldn't reach our servers. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-base font-semibold text-white">Check your email</h2>
        <p className="mt-2 text-sm text-white/60">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
      </div>
    );
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
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring w-full rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
