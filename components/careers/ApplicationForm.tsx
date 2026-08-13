"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplicationForm({
  jobSlug,
  jobTitle,
  submitLabel = "Submit Application",
}: {
  jobSlug: string;
  jobTitle: string;
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("jobSlug", jobSlug);
    data.set("jobTitle", jobTitle);

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
      setFileName(null);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again, or email us directly at support@acendia.agency.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-6 text-center">
        <h3 className="text-lg font-semibold text-white">Application received</h3>
        <p className="mt-2 text-sm text-white/60">
          Thanks for applying to {jobTitle}. Our team will review your application and reach out if it&apos;s a fit.
        </p>
      </div>
    );
  }

  const inputClass =
    "focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
      {/* Honeypot — hidden from real users via CSS, not `display:none` /
          `hidden`, so screen readers relying on the accessibility tree
          alone still skip it correctly while it stays a normal tabbable-if-
          visible field bots tend to fill in. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company_website">Company Website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-white/80">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input id="fullName" name="fullName" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white/80">
            Phone (optional)
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="linkedInOrPortfolio" className="mb-1.5 block text-sm font-medium text-white/80">
            LinkedIn / portfolio / video intro (optional)
          </label>
          <input id="linkedInOrPortfolio" name="linkedInOrPortfolio" type="text" placeholder="https://" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-white/80">
          Tell us about yourself <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder="Your experience, what you've sold or built before, and anything else relevant to this role."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cv" className="mb-1.5 block text-sm font-medium text-white/80">
          CV / résumé (PDF or Word, 8MB max)
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          className="focus-ring block w-full text-sm text-white/70 file:mr-4 file:rounded-[var(--r-sm)] file:border file:border-[var(--border-hi)] file:bg-white/5 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition-colors hover:file:bg-white/10"
        />
        {fileName && <p className="mt-1.5 text-xs text-white/40">Selected: {fileName}</p>}
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring inline-flex w-full items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
