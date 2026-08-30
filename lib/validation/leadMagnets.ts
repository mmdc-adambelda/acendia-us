import { z } from "zod";

export const leadMagnetFormSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name").max(150),
  businessName: z.string().trim().min(1, "Enter your business/company name").max(200),
  workEmail: z.string().trim().email("Enter a valid work email").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(40),
  websiteUrl: z.string().trim().min(1, "Enter your website URL").max(300),
  challenge: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — real users never fill this in. Deliberately not named after
  // any real field on this form (e.g. not "company_website", which would
  // collide semantically with the real "Website URL" field here and risk
  // browser autofill populating it for genuine visitors).
  //
  // Deliberately NOT `.max(0)` — a non-empty value here must still pass
  // schema validation so the route's own honeypot check (redirect to the
  // "success" unlock page as if nothing happened, so a bot never learns
  // its submission was rejected) actually runs, instead of the request
  // dying earlier at validation with a visible "check the form" error.
  middle_name: z.string().max(500).optional().or(z.literal("")),
});

export type LeadMagnetFormFields = z.infer<typeof leadMagnetFormSchema>;
