"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { INDUSTRIES, PRIORITY_STATES, SERVICES } from "@/lib/site";

const STATE_OPTIONS = [...PRIORITY_STATES, "Other US state"];
const INDUSTRY_OPTIONS = [...INDUSTRIES.map((i) => i.name), "Other"];
const SERVICE_OPTIONS = [...SERVICES.map((s) => s.name), "Not sure yet"];

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm({
  source,
  submitLabel = "Request My Free SEO Audit",
}: {
  source: "free-seo-audit" | "contact";
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  function handleFirstInteraction() {
    if (!started) {
      setStarted(true);
      trackEvent("audit_form_started", { source });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName"),
      businessName: data.get("businessName"),
      businessEmail: data.get("businessEmail"),
      phone: data.get("phone"),
      websiteUrl: data.get("websiteUrl") || "",
      state: data.get("state"),
      city: data.get("city"),
      industry: data.get("industry"),
      primaryService: data.get("primaryService"),
      challenge: data.get("challenge") || "",
      consent: data.get("consent") === "on",
      company_website: data.get("company_website") || "",
      formSource: source,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      trackEvent(source === "free-seo-audit" ? "audit_form_submitted" : "contact_form_submitted", {
        source,
      });
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--card)] p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-white">Thanks — we&apos;ve got it.</h3>
        <p className="mt-2 text-sm text-white/60">
          A member of our team will review your details and follow up within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={handleFirstInteraction} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, visible to bots that fill every field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Leave this field blank</label>
        <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required autoComplete="name" />
        <Field label="Business name" name="businessName" required autoComplete="organization" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Business email" name="businessEmail" type="email" required autoComplete="email" />
        <Field label="Phone number" name="phone" type="tel" required autoComplete="tel" placeholder="(555) 123-4567" />
      </div>

      <Field label="Website URL (if you have one)" name="websiteUrl" type="url" autoComplete="url" placeholder="https://" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select label="State" name="state" required options={STATE_OPTIONS} />
        <Field label="City" name="city" required autoComplete="address-level2" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select label="Industry" name="industry" required options={INDUSTRY_OPTIONS} />
        <Select label="Primary service needed" name="primaryService" required options={SERVICE_OPTIONS} />
      </div>

      <div>
        <label htmlFor="challenge" className="mb-1.5 block text-sm font-medium text-white/80">
          What&apos;s your biggest marketing challenge right now?
        </label>
        <textarea
          id="challenge"
          name="challenge"
          rows={4}
          className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
          placeholder="Optional — a sentence or two is plenty"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          className="focus-ring mt-1 h-4 w-4 shrink-0 rounded border border-[var(--border-hi)] bg-black/40"
        />
        <label htmlFor="consent" className="text-sm text-white/60">
          I agree to be contacted by Acendia about my request. See our{" "}
          <a href="/privacy-policy/" className="underline hover:text-white">
            Privacy Policy
          </a>
          .
        </label>
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring inline-flex w-full items-center justify-center rounded-[var(--r-sm)] bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
