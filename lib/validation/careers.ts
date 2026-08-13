import { z } from "zod";

export const applicationFieldsSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name").max(150),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  linkedInOrPortfolio: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Tell us a bit about yourself").max(5000),
  jobSlug: z.string().trim().min(1),
  jobTitle: z.string().trim().min(1),
  // Honeypot — real users never fill this in.
  company_website: z.string().max(200).optional().or(z.literal("")),
});

export type ApplicationFields = z.infer<typeof applicationFieldsSchema>;

export const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_CV_BYTES = 8 * 1024 * 1024; // 8MB
