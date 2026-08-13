"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MAIN_GOAL_OPTIONS,
  US_STATES,
  EMPLOYEE_COUNT_OPTIONS,
  type AccountStepValues,
  type BusinessStepValues,
  type WebsiteStepValues,
  type GoalsStepValues,
} from "@/lib/validation/register";

export type PlanOption = {
  id: string;
  name: string;
  slug: string;
  planType: string;
  setupFeeCents: number | null;
  monthlyPriceCents: number | null;
  features: string[];
};

const STEPS = ["Account", "Business", "Website & Marketing", "Goals", "Plan"] as const;

function formatMoney(cents: number | null) {
  if (cents === null) return null;
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: cents % 100 === 0 ? 0 : 2 })}`;
}

// Maps the server's dotted field paths (e.g. "website.websiteUrl") to the
// step + label a person actually recognizes, so a validation failure on
// the final submit says exactly what to fix instead of a generic "check
// the form." Falls back to the raw path for anything not mapped here.
const FIELD_LABELS: Record<string, string> = {
  "account.firstName": "First name",
  "account.lastName": "Last name",
  "account.email": "Business email",
  "account.phone": "Phone (must be a US number, e.g. (555) 123-4567)",
  "business.businessName": "Business name",
  "business.industry": "Industry",
  "business.employeeCount": "Number of employees",
  "business.city": "City",
  "business.state": "State",
  "business.zip": "ZIP code",
  "business.address": "Business address",
  "website.websiteUrl": "Website URL (must start with https://)",
  "website.primaryService": "Primary service",
  "goals.mainGoal": "Main business goal",
  "plan.planId": "Plan selection",
};

function buildValidationErrorMessage(json: { error?: string; fieldIssues?: { path: string; message: string }[] }): string {
  if (!json.fieldIssues || json.fieldIssues.length === 0) {
    return json.error ?? "Something went wrong. Please try again.";
  }
  const lines = json.fieldIssues.map((issue) => {
    const label = FIELD_LABELS[issue.path] ?? issue.path;
    return `${label}: ${issue.message}`;
  });
  return `Please fix the following:\n${lines.join("\n")}`;
}

export default function RegisterWizard({ plans }: { plans: PlanOption[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [account, setAccount] = useState<Partial<AccountStepValues>>({});
  const [business, setBusiness] = useState<Partial<BusinessStepValues>>({});
  const [website, setWebsite] = useState<Partial<WebsiteStepValues>>({});
  const [goals, setGoals] = useState<Partial<GoalsStepValues>>({ priorityServices: [] });
  const corePlan = plans.find((p) => p.planType === "core");
  const addonPlans = plans.filter((p) => p.planType === "addon");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  async function handleAccountSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const values: AccountStepValues = {
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      password: String(form.get("password") || ""),
      confirmPassword: String(form.get("confirmPassword") || ""),
    };
    if (values.password !== values.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (values.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { first_name: values.firstName, last_name: values.lastName, phone: values.phone },
          emailRedirectTo: `${window.location.origin}/verify-email/`,
        },
      });

      if (signUpError) {
        setError(
          signUpError.message.toLowerCase().includes("already registered") ||
            signUpError.message.toLowerCase().includes("already exists")
            ? "An account already exists for this email. Try logging in instead."
            : signUpError.message
        );
        return;
      }
      if (!data.user) {
        setError("Something went wrong creating your account. Please try again.");
        return;
      }

      setUserId(data.user.id);
      setAccount(values);
      setStep(1);
    } catch (err) {
      console.error("signUp failed", err);
      setError("We couldn't reach our servers to create your account. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBusinessSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusiness({
      businessName: String(form.get("businessName") || ""),
      industry: String(form.get("industry") || ""),
      employeeCount: String(form.get("employeeCount") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      zip: String(form.get("zip") || ""),
      address: String(form.get("address") || ""),
    });
    setStep(2);
  }

  function handleWebsiteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setWebsite({
      websiteUrl: String(form.get("websiteUrl") || ""),
      primaryService: String(form.get("primaryService") || ""),
      targetCity: String(form.get("targetCity") || ""),
      targetState: String(form.get("targetState") || ""),
      additionalLocations: String(form.get("additionalLocations") || ""),
      currentSeoProvider: String(form.get("currentSeoProvider") || ""),
      googleBusinessProfileUrl: String(form.get("googleBusinessProfileUrl") || ""),
      competitors: String(form.get("competitors") || ""),
      approxMonthlyLeads: String(form.get("approxMonthlyLeads") || ""),
      approxMonthlyTraffic: String(form.get("approxMonthlyTraffic") || ""),
      primaryChallenge: String(form.get("primaryChallenge") || ""),
    });
    setStep(3);
  }

  function handleGoalsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setGoals({
      mainGoal: String(form.get("mainGoal") || ""),
      targetLeadVolume: String(form.get("targetLeadVolume") || ""),
      priorityLocations: String(form.get("priorityLocations") || ""),
      priorityServices: goals.priorityServices ?? [],
    });
    setStep(4);
  }

  async function handlePlanSubmit() {
    if (!userId || !corePlan) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          account: {
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phone: account.phone,
          },
          business,
          website,
          goals,
          plan: { planId: corePlan.id, billingCycle: "monthly", addonPlanIds: selectedAddons },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(buildValidationErrorMessage(json));
        setSubmitting(false);
        return;
      }
      router.push("/verify-email/");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <ol className="mb-10 flex flex-wrap gap-2" aria-label="Registration progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              i === step
                ? "border-[var(--border-hi)] text-white"
                : i < step
                  ? "border-[var(--border)] text-white/50"
                  : "border-[var(--border-dim)] text-white/30"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                i <= step ? "bg-white text-black" : "bg-white/10 text-white/40"
              }`}
            >
              {i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {error && (
        <p role="alert" className="mb-6 whitespace-pre-line rounded-[var(--r-sm)] border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {step === 0 && (
        <form onSubmit={handleAccountSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="First name" name="firstName" required autoComplete="given-name" defaultValue={account.firstName} />
            <Field label="Last name" name="lastName" required autoComplete="family-name" defaultValue={account.lastName} />
          </div>
          <Field label="Business email" name="email" type="email" required autoComplete="email" defaultValue={account.email} />
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" placeholder="(555) 123-4567" defaultValue={account.phone} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Password" name="password" type="password" required autoComplete="new-password" hint="At least 8 characters" />
            <Field label="Confirm password" name="confirmPassword" type="password" required autoComplete="new-password" />
          </div>
          <StepActions submitting={submitting} nextLabel="Create Account" />
        </form>
      )}

      {step === 1 && (
        <form onSubmit={handleBusinessSubmit} className="space-y-5">
          <Field label="Business name" name="businessName" required defaultValue={business.businessName} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Industry" name="industry" required defaultValue={business.industry} placeholder="e.g. Roofing, Legal, Healthcare" />
            <Select label="Number of employees" name="employeeCount" required options={EMPLOYEE_COUNT_OPTIONS} defaultValue={business.employeeCount} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="City" name="city" required defaultValue={business.city} />
            <Select label="State" name="state" required options={US_STATES} defaultValue={business.state} />
            <Field label="ZIP code" name="zip" defaultValue={business.zip} />
          </div>
          <Field label="Business address (optional)" name="address" defaultValue={business.address} />
          <StepActions submitting={submitting} onBack={() => setStep(0)} />
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleWebsiteSubmit} className="space-y-5">
          <Field label="Website URL" name="websiteUrl" type="url" required placeholder="https://" defaultValue={website.websiteUrl} />
          <Field label="Primary service you need" name="primaryService" required defaultValue={website.primaryService} placeholder="e.g. Local SEO" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Primary target city" name="targetCity" defaultValue={website.targetCity} />
            <Select label="Primary target state" name="targetState" options={US_STATES} defaultValue={website.targetState} />
          </div>
          <Field label="Additional target locations (optional)" name="additionalLocations" defaultValue={website.additionalLocations} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Current SEO provider, if any" name="currentSeoProvider" defaultValue={website.currentSeoProvider} />
            <Field label="Google Business Profile URL, if any" name="googleBusinessProfileUrl" defaultValue={website.googleBusinessProfileUrl} />
          </div>
          <Field label="Main competitors (comma separated)" name="competitors" defaultValue={website.competitors} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Approx. monthly leads" name="approxMonthlyLeads" defaultValue={website.approxMonthlyLeads} />
            <Field label="Approx. monthly website traffic" name="approxMonthlyTraffic" defaultValue={website.approxMonthlyTraffic} />
          </div>
          <div>
            <label htmlFor="primaryChallenge" className="mb-1.5 block text-sm font-medium text-white/80">
              What's your primary marketing challenge?
            </label>
            <textarea
              id="primaryChallenge"
              name="primaryChallenge"
              rows={3}
              defaultValue={website.primaryChallenge}
              className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
            />
          </div>
          <StepActions submitting={submitting} onBack={() => setStep(1)} />
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleGoalsSubmit} className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-white/80">What's your main business goal?</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {MAIN_GOAL_OPTIONS.map((goal) => (
                <label
                  key={goal}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[var(--r-sm)] border border-[var(--border)] px-4 py-3 text-sm text-white/80 has-[:checked]:border-[var(--border-hi)] has-[:checked]:bg-white/5"
                >
                  <input type="radio" name="mainGoal" value={goal} required defaultChecked={goals.mainGoal === goal} className="focus-ring" />
                  {goal}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Target monthly lead volume (optional)" name="targetLeadVolume" defaultValue={goals.targetLeadVolume} />
          <Field label="Priority locations (optional)" name="priorityLocations" defaultValue={goals.priorityLocations} />
          <StepActions submitting={submitting} onBack={() => setStep(2)} />
        </form>
      )}

      {step === 4 && (
        <div className="space-y-6">
          {corePlan ? (
            <div className="rounded-[var(--r-lg)] border border-[var(--border-hi)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-semibold text-white">{corePlan.name}</h3>
              {corePlan.setupFeeCents !== null && (
                <p className="mt-1 text-sm text-white/60">
                  {formatMoney(corePlan.setupFeeCents)} one-time setup
                  {corePlan.monthlyPriceCents !== null && ` + ${formatMoney(corePlan.monthlyPriceCents)}/month`}
                </p>
              )}
              <ul className="mt-4 space-y-2">
                {corePlan.features.map((f) => (
                  <li key={f} className="text-sm text-white/60">— {f}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-white/50">No active plan is configured yet — contact us directly to get started.</p>
          )}

          {addonPlans.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium text-white/80">Optional add-ons</h4>
              <div className="space-y-2">
                {addonPlans.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex cursor-pointer items-start gap-3 rounded-[var(--r-sm)] border border-[var(--border)] px-4 py-3 has-[:checked]:border-[var(--border-hi)] has-[:checked]:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      className="focus-ring mt-1"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={(e) =>
                        setSelectedAddons((prev) =>
                          e.target.checked ? [...prev, addon.id] : prev.filter((id) => id !== addon.id)
                        )
                      }
                    />
                    <span>
                      <span className="block text-sm font-medium text-white">
                        {addon.name} {addon.monthlyPriceCents !== null && `— ${formatMoney(addon.monthlyPriceCents)}/mo`}
                      </span>
                      <span className="mt-0.5 block text-xs text-white/50">{addon.features[0]}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-white/40">
            Continuing takes you to checkout, where you&apos;ll pay only the one-time setup fee today. Your monthly
            plan isn&apos;t billed until 14 days after your site goes live — never bundled with the setup fee.
          </p>

          <StepActions
            submitting={submitting}
            onBack={() => setStep(3)}
            nextLabel="Continue"
            onNext={handlePlanSubmit}
            hideSubmitButton
          />
        </div>
      )}
    </div>
  );
}

function StepActions({
  submitting,
  onBack,
  nextLabel = "Continue",
  onNext,
  hideSubmitButton,
}: {
  submitting: boolean;
  onBack?: () => void;
  nextLabel?: string;
  onNext?: () => void;
  hideSubmitButton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="focus-ring text-sm font-medium text-white/60 hover:text-white"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      {hideSubmitButton ? (
        <button
          type="button"
          onClick={onNext}
          disabled={submitting}
          className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : nextLabel}
        </button>
      ) : (
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring inline-flex items-center rounded-[var(--r-sm)] bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:shadow-[var(--glow-white)] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : nextLabel}
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
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
        defaultValue={defaultValue}
        className="focus-ring w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30"
      />
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={defaultValue ?? ""}
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
