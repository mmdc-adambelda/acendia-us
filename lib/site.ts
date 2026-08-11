// Central site configuration. Keep business-identity facts here so every
// page, schema block, and metadata call reads from one source of truth.

export const SITE_URL = "https://acendia.us";
export const SITE_NAME = "Acendia International";
export const TAGLINE = "YOUR Business, OUR Business";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/acendia.international",
  linkedin: "https://www.linkedin.com/company/acendia-international",
  instagram: "https://www.instagram.com/acendia.international",
};

// No phone/email is published directly per business decision — all
// contact flows route through /contact/. Fill these in once approved,
// then wire ContactPoint schema and footer links to them.
export const CONTACT = {
  phonePlaceholder: "[PHONE_PLACEHOLDER]",
  emailPlaceholder: "[EMAIL_PLACEHOLDER]",
  contactPageUrl: "/contact/",
};

export const NAV_LINKS = [
  { label: "Services", href: "/services/" },
  { label: "Industries", href: "/industries/" },
  { label: "Locations", href: "/locations/" },
  { label: "Case Studies", href: "/case-studies/" },
  { label: "Insights", href: "/insights/" },
  { label: "About", href: "/about/" },
];

// Core services surfaced in the header "Services" dropdown — a curated
// subset of the full 11-service catalog, not the whole list (see
// SERVICES below for that). Icon names match ICON_MAP in components/icons.tsx.
export const CORE_SERVICES_MENU = [
  { label: "Search Engine Optimization", href: "/services/seo/", icon: "search", blurb: "Durable organic rankings built on real search intent." },
  { label: "Website Development", href: "/services/website-development/", icon: "code", blurb: "Fast, technically sound builds engineered to convert." },
  { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/", icon: "badge-check", blurb: "Google Maps SEO that turns your listing into a lead source." },
  { label: "Digital Marketing", href: "/services/ai-digital-marketing/", icon: "sparkles", blurb: "AI-native marketing built for how search is changing." },
  { label: "Lead Generation", href: "/services/lead-generation/", icon: "target", blurb: "Turn traffic into booked calls and signed contracts." },
  { label: "Content Marketing", href: "/services/content-marketing/", icon: "file-text", blurb: "Content built to rank and move buyers toward a decision." },
];

export const FOOTER_LINK_COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Website Design", href: "/services/website-design/" },
      { label: "Lead Generation", href: "/services/lead-generation/" },
      { label: "View all services →", href: "/services/" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Home Services", href: "/industries/home-services/" },
      { label: "Law Firm SEO", href: "/industries/law-firm-seo/" },
      { label: "Healthcare", href: "/industries/healthcare/" },
      { label: "View all industries →", href: "/industries/" },
    ],
  },
  {
    title: "Locations",
    links: [
      { label: "Texas", href: "/locations/texas/" },
      { label: "Florida", href: "/locations/florida/" },
      { label: "California", href: "/locations/california/" },
      { label: "View all locations →", href: "/locations/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Insights", href: "/insights/" },
      { label: "Free SEO Audit", href: "/free-seo-audit/" },
      { label: "Contact", href: "/contact/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms of Service", href: "/terms/" },
    ],
  },
];

export type ServiceSummary = {
  slug: string;
  name: string;
  shortName: string;
  oneLiner: string;
  icon: string;
};

export const SERVICES: ServiceSummary[] = [
  { slug: "seo", name: "Search Engine Optimization", shortName: "SEO", oneLiner: "Earn durable organic rankings that keep paying back long after the campaign ends.", icon: "search" },
  { slug: "local-seo", name: "Local SEO", shortName: "Local SEO", oneLiner: "Win the map pack and the neighborhoods you actually serve.", icon: "map-pin" },
  { slug: "technical-seo", name: "Technical SEO", shortName: "Technical SEO", oneLiner: "Fix the crawl, speed, and indexation issues quietly capping your growth.", icon: "cpu" },
  { slug: "google-business-profile-optimization", name: "Google Business Profile Optimization", shortName: "Google Business Profile", oneLiner: "Turn your Business Profile into a lead source, not an afterthought.", icon: "badge-check" },
  { slug: "website-design", name: "Website Design", shortName: "Website Design", oneLiner: "Premium, on-brand design that builds trust in the first three seconds.", icon: "layout" },
  { slug: "website-development", name: "Website Development", shortName: "Website Development", oneLiner: "Fast, modern builds engineered for Core Web Vitals and conversions.", icon: "code" },
  { slug: "content-marketing", name: "Content Marketing", shortName: "Content Marketing", oneLiner: "Content built to rank, answer, and move buyers toward a decision.", icon: "file-text" },
  { slug: "lead-generation", name: "Lead Generation", shortName: "Lead Generation", oneLiner: "Turn organic and paid traffic into booked calls and signed contracts.", icon: "target" },
  { slug: "conversion-rate-optimization", name: "Conversion Rate Optimization", shortName: "CRO", oneLiner: "Get more revenue out of the traffic you're already earning.", icon: "trending-up" },
  { slug: "multi-location-seo", name: "Multi-Location SEO", shortName: "Multi-Location SEO", oneLiner: "Scale visibility across every market without duplicating your way into a penalty.", icon: "layers" },
  { slug: "ai-digital-marketing", name: "AI Digital Marketing", shortName: "AI Digital Marketing", oneLiner: "Show up in AI search summaries, not just the blue links.", icon: "sparkles" },
];

export type IndustrySummary = {
  slug: string;
  name: string;
  oneLiner: string;
};

export const INDUSTRIES: IndustrySummary[] = [
  { slug: "home-services", name: "Home Services", oneLiner: "Roofers, HVAC, plumbers, electricians, and restoration companies competing for local jobs." },
  { slug: "legal", name: "Legal Services", oneLiner: "Law firms where one qualified case can fund a quarter of marketing spend." },
  { slug: "healthcare", name: "Healthcare & Aesthetics", oneLiner: "Dental, medical, and med spa practices built on repeat and referral patients." },
  { slug: "real-estate", name: "Real Estate & Property", oneLiner: "Agents, property managers, and brokers competing on local search visibility." },
  { slug: "moving-and-logistics", name: "Moving & Logistics", oneLiner: "Movers and storage companies fighting lead-gen platforms for direct bookings." },
  { slug: "automotive", name: "Automotive Services", oneLiner: "Repair, towing, and detailing shops that live and die by local search." },
  { slug: "professional-services", name: "Professional & B2B Services", oneLiner: "Accounting, IT, staffing, and consulting firms selling trust before a contract." },
];

export const PRIORITY_STATES = [
  "Texas", "Florida", "California", "New York", "Georgia",
  "North Carolina", "Arizona", "Illinois",
];

// Phase 2 expansion states — live pages, second-tier launch markets.
export const EXPANSION_STATES = [
  "Pennsylvania", "New Jersey", "Tennessee", "Colorado", "Washington",
  "Virginia", "Nevada", "Massachusetts", "Ohio", "Michigan", "Utah",
  "South Carolina",
];

export const PRIORITY_CITIES = [
  { city: "Houston", state: "Texas", slug: "houston", stateSlug: "texas" },
  { city: "Dallas", state: "Texas", slug: "dallas", stateSlug: "texas" },
  { city: "Austin", state: "Texas", slug: "austin", stateSlug: "texas" },
  { city: "Miami", state: "Florida", slug: "miami", stateSlug: "florida" },
  { city: "Tampa", state: "Florida", slug: "tampa", stateSlug: "florida" },
  { city: "Los Angeles", state: "California", slug: "los-angeles", stateSlug: "california" },
  { city: "San Diego", state: "California", slug: "san-diego", stateSlug: "california" },
  { city: "New York City", state: "New York", slug: "new-york-city", stateSlug: "new-york" },
  { city: "Atlanta", state: "Georgia", slug: "atlanta", stateSlug: "georgia" },
  { city: "Charlotte", state: "North Carolina", slug: "charlotte", stateSlug: "north-carolina" },
  { city: "Raleigh", state: "North Carolina", slug: "raleigh", stateSlug: "north-carolina" },
  { city: "Phoenix", state: "Arizona", slug: "phoenix", stateSlug: "arizona" },
  { city: "Scottsdale", state: "Arizona", slug: "scottsdale", stateSlug: "arizona" },
  { city: "Chicago", state: "Illinois", slug: "chicago", stateSlug: "illinois" },
  { city: "Orlando", state: "Florida", slug: "orlando", stateSlug: "florida" },
];

export const INDUSTRY_CATEGORY_SLUGS: Record<string, string> = {
  "home-services": "home-services",
  legal: "law-firm-seo",
  healthcare: "healthcare",
  "real-estate": "real-estate",
  "moving-and-logistics": "moving-and-logistics",
  automotive: "automotive",
  "professional-services": "professional-services",
};
