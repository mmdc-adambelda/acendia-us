"use client";

import { useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { LeadMagnet } from "@/lib/leadMagnets";

/**
 * Real HTML form POST straight to the generic lead-magnet subscribe
 * route — not fetch(), same reasoning as every other public lead form in
 * this app: a real top-level form submission works even with JS
 * disabled/blocked, and is far more resistant to a browser/extension
 * silently withholding a fetch() call than the JS-only alternative.
 *
 * The "use client" boundary here exists ONLY to fire analytics
 * (ebook_form_start on first interaction, ebook_form_submit on submit) —
 * it does not change the form's native method/action submission at all,
 * so the form still works end-to-end with JavaScript disabled; only the
 * two analytics events are lost in that case.
 */
export default function LeadMagnetForm({ magnet, errorMessage }: { magnet: LeadMagnet; errorMessage?: string }) {
  const startedRef = useRef(false);

  function handleFormStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("ebook_form_start");
  }

  function handleSubmit() {
    trackEvent("ebook_form_submit");
  }

  const inputClass =
    "focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30";

  return (
    <form
      method="POST"
      action={`/api/lead-magnets/${magnet.slug}/subscribe`}
      onFocus={handleFormStart}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Honeypot — hidden from real users via off-screen positioning, not
          display:none, so screen readers relying on the accessibility tree
          alone still skip it while it stays a normal tabbable-if-visible
          field bots tend to fill in. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="middle_name">Middle Name</label>
        <input id="middle_name" name="middle_name" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-white/80">
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input id="fullName" name="fullName" type="text" required autoComplete="name" className={inputClass} />
      </div>

      <div>
        <label htmlFor="businessName" className="mb-1.5 block text-sm font-medium text-white/80">
          Business / Company Name <span aria-hidden="true">*</span>
        </label>
        <input id="businessName" name="businessName" type="text" required autoComplete="organization" className={inputClass} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="workEmail" className="mb-1.5 block text-sm font-medium text-white/80">
            Work Email <span aria-hidden="true">*</span>
          </label>
          <input id="workEmail" name="workEmail" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white/80">
            Phone Number <span aria-hidden="true">*</span>
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="websiteUrl" className="mb-1.5 block text-sm font-medium text-white/80">
          Website URL <span aria-hidden="true">*</span>
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="text"
          required
          placeholder="https://"
          autoComplete="url"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="challenge" className="mb-1.5 block text-sm font-medium text-white/80">
          What is your biggest SEO challenge? <span className="text-white/40">(optional)</span>
        </label>
        <textarea id="challenge" name="challenge" rows={4} className={inputClass} />
      </div>

      <p className="text-xs leading-relaxed text-white/40">{magnet.form.consentText}</p>

      <button
        type="submit"
        data-event="ebook_form_submit"
        className="focus-ring inline-flex w-full items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-black transition-all hover:shadow-[var(--glow-white)]"
      >
        {magnet.form.ctaLabel}
      </button>
    </form>
  );
}
