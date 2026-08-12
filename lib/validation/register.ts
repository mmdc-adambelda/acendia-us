import { z } from "zod";

const usPhoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Kept as a plain object schema (no .refine()) so it can still be
// `.omit()`-ed elsewhere (registerCompleteSchema) — Zod v4 disallows
// .omit()/.pick() on a schema that already carries a .refine(). The
// password-match check lives on accountStepSchema below instead.
export const accountFieldsSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80),
  lastName: z.string().trim().min(1, "Enter your last name").max(80),
  email: z.string().trim().email("Enter a valid business email").max(200),
  phone: z.string().trim().regex(usPhoneRegex, "Enter a valid US phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  confirmPassword: z.string(),
});

export const accountStepSchema = accountFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: "Passwords don't match", path: ["confirmPassword"] }
);

export const businessStepSchema = z.object({
  businessName: z.string().trim().min(1, "Enter your business name").max(160),
  industry: z.string().trim().min(1, "Select your industry"),
  employeeCount: z.string().trim().min(1, "Select a company size"),
  city: z.string().trim().min(1, "Enter your city").max(100),
  state: z.string().trim().min(1, "Select your state"),
  zip: z.string().trim().max(12).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
});

export const websiteStepSchema = z.object({
  websiteUrl: z.string().trim().url("Enter a valid website URL, including https://").max(300),
  primaryService: z.string().trim().min(1, "Select the service you need"),
  targetCity: z.string().trim().max(100).optional().or(z.literal("")),
  targetState: z.string().trim().max(60).optional().or(z.literal("")),
  additionalLocations: z.string().trim().max(400).optional().or(z.literal("")),
  currentSeoProvider: z.string().trim().max(160).optional().or(z.literal("")),
  googleBusinessProfileUrl: z.string().trim().max(300).optional().or(z.literal("")),
  competitors: z.string().trim().max(400).optional().or(z.literal("")),
  approxMonthlyLeads: z.string().trim().max(60).optional().or(z.literal("")),
  approxMonthlyTraffic: z.string().trim().max(60).optional().or(z.literal("")),
  primaryChallenge: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const goalsStepSchema = z.object({
  mainGoal: z.string().trim().min(1, "Select your main goal"),
  targetLeadVolume: z.string().trim().max(60).optional().or(z.literal("")),
  priorityServices: z.array(z.string()).max(20).optional().default([]),
  priorityLocations: z.string().trim().max(400).optional().or(z.literal("")),
});

export const planStepSchema = z.object({
  planId: z.string().uuid("Select a plan"),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]),
  addonPlanIds: z.array(z.string().uuid()).optional().default([]),
});

export const registerCompleteSchema = z.object({
  userId: z.string().uuid(),
  account: accountFieldsSchema.omit({ password: true, confirmPassword: true }),
  business: businessStepSchema,
  website: websiteStepSchema,
  goals: goalsStepSchema,
  plan: planStepSchema,
});

export type AccountStepValues = z.infer<typeof accountStepSchema>;
export type BusinessStepValues = z.infer<typeof businessStepSchema>;
export type WebsiteStepValues = z.infer<typeof websiteStepSchema>;
export type GoalsStepValues = z.infer<typeof goalsStepSchema>;
export type PlanStepValues = z.infer<typeof planStepSchema>;
export type RegisterCompletePayload = z.infer<typeof registerCompleteSchema>;

export const MAIN_GOAL_OPTIONS = [
  "Generate more leads",
  "Rank higher on Google",
  "Rank in Google Maps",
  "Improve website conversions",
  "Launch/rebuild website",
  "Improve local SEO",
  "Improve AI search visibility",
  "Multi-location SEO",
  "Other",
];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

export const EMPLOYEE_COUNT_OPTIONS = ["1 (solo)", "2-10", "11-50", "51-200", "200+"];
