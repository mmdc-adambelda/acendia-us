// Conversion event helper. Fires a dataLayer push (GTM/GA4 convention) if
// the tag manager is present, and is a safe no-op otherwise — nothing here
// assumes any tracking ID is actually configured.

export type ConversionEvent =
  | "audit_form_started"
  | "audit_form_submitted"
  | "contact_form_submitted"
  | "phone_cta_clicked"
  | "email_cta_clicked"
  | "audit_cta_clicked"
  | "consultation_cta_clicked"
  | "service_page_cta_clicked"
  | "location_cta_clicked"
  | "industry_page_cta_clicked";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(event: ConversionEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}
