"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          "That reset link may have expired. Request a new one from the forgot password page."
        );
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login/"), 1500);
    } catch (err) {
      console.error("updateUser failed", err);
      setError("We couldn't reach our servers. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-base font-semibold text-white">Password updated</h2>
        <p className="mt-2 text-sm text-white/60">Redirecting you to log in…</p>
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
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-white/80">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="focus-ring w-full rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60"
      >
        {submitting ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
