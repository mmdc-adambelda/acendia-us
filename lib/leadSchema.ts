import { z } from "zod";

// US phone: allow common formats, 10 digits after stripping formatting.
const usPhoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  businessName: z.string().trim().min(2, "Enter your business name").max(160),
  businessEmail: z.string().trim().email("Enter a valid business email").max(200),
  phone: z
    .string()
    .trim()
    .regex(usPhoneRegex, "Enter a valid US phone number, e.g. (555) 123-4567"),
  websiteUrl: z.string().trim().max(200).optional().or(z.literal("")),
  state: z.string().trim().min(2, "Select your state").max(60),
  city: z.string().trim().min(2, "Enter your city").max(100),
  industry: z.string().trim().min(2, "Select your industry").max(100),
  primaryService: z.string().trim().min(2, "Select the service you need").max(100),
  challenge: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "You must agree to be contacted to submit this form" }),
  // Honeypot — real users never see or fill this field.
  company_website: z.string().max(0).optional().or(z.literal("")),
  formSource: z.enum(["free-seo-audit", "contact"]),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
