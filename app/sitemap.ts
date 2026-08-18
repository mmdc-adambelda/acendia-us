import type { MetadataRoute } from "next";
import { SITE_URL, SERVICES } from "@/lib/site";
import { STATE_CONTENT, CITY_CONTENT } from "@/lib/locationContent";
import { INDUSTRY_CONTENT } from "@/lib/industryContent";
import { ARTICLES } from "@/lib/articles";
import { JOBS } from "@/lib/careers";

const STATIC_PATHS = [
  "/",
  "/about/",
  "/services/",
  "/pricing/",
  "/contact/",
  "/case-studies/",
  "/insights/",
  "/locations/",
  "/industries/",
  "/free-seo-audit/",
  "/careers/",
  "/privacy-policy/",
  "/terms/",
];

// Never add anything under these prefixes here — they're authenticated app
// routes (client portal, admin, checkout, auth) and must stay out of the
// sitemap. See middleware.ts + robots.ts for the enforcement layers.
// /login/ /register/ /forgot-password/ /reset-password/
// /get-started/ /checkout/* /onboarding/ /portal/* /admin/*

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const serviceEntries = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const stateEntries = Object.values(STATE_CONTENT).map((s) => ({
    url: `${SITE_URL}/locations/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityEntries = Object.values(CITY_CONTENT).map((c) => ({
    url: `${SITE_URL}/locations/${c.stateSlug}/${c.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const industryEntries = Object.values(INDUSTRY_CONTENT).map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleEntries = ARTICLES.filter((a) => a.published).map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}/`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const careerEntries = JOBS.map((j) => ({
    url: `${SITE_URL}/careers/${j.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // The one job with a real, published commission structure gets its own
  // deep-linked breakdown page (linked from the job listing itself).
  const commissionPlanEntry = {
    url: `${SITE_URL}/careers/full-cycle-sales-closer/commission-plan/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  };

  return [
    ...staticEntries,
    ...serviceEntries,
    ...stateEntries,
    ...cityEntries,
    ...industryEntries,
    ...articleEntries,
    ...careerEntries,
    commissionPlanEntry,
  ];
}
