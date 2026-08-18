import { z } from "zod";

// Fields per the owner's spec for the post-payment onboarding form —
// deliberately lean (no password field: the account is created server-
// side and the client sets their own password via an emailed link). Phone
// has no format requirement, per explicit instruction.
export const getStartedCompleteSchema = z.object({
  sessionId: z.string().min(1, "Missing payment session."),
  businessName: z.string().trim().min(1, "Enter your business name").max(160),
  contactName: z.string().trim().min(1, "Enter your name").max(160),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(1, "Enter a phone number").max(40),
  websiteUrl: z.string().trim().max(300).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "Enter your city").max(100),
  state: z.string().trim().min(1, "Select your state").max(100),
  zip: z.string().trim().max(12).optional().or(z.literal("")),
  primaryService: z.string().trim().min(1, "Enter your primary service/industry").max(160),
  keywords: z.string().trim().max(500).optional().or(z.literal("")),
  competitors: z.string().trim().max(500).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type GetStartedCompleteValues = z.infer<typeof getStartedCompleteSchema>;

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];
