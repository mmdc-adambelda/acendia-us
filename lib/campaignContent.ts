export type CampaignContent = {
  slug: string;
  headline: string;
  subheadline: string;
  audience: string;
  metaTitle: string;
  metaDescription: string;
  offerPoints: string[];
  faqs: { question: string; answer: string }[];
};

// Campaign landing pages are built for outbound email/LinkedIn and paid
// campaigns matching a specific industry + market combination. They stay
// noindex (see app/campaigns/[slug]/page.tsx) since they're intentionally
// thin, single-offer pages meant to match ad/email copy — not to rank.
export const CAMPAIGN_CONTENT: Record<string, CampaignContent> = {
  "roofing-companies-texas": {
    slug: "roofing-companies-texas",
    headline: "A Free Local SEO Audit for Texas Roofing Companies",
    subheadline:
      "See exactly where your roofing business is losing visibility to competitors across Houston, Dallas, Austin, and San Antonio — before the next storm season.",
    audience: "Texas roofing companies",
    metaTitle: "Free SEO Audit for Texas Roofing Companies",
    metaDescription: "A free, no-obligation local SEO audit built specifically for Texas roofing companies competing for storm-driven and routine roofing searches.",
    offerPoints: [
      "A review of your Google Business Profile against top-ranking Texas roofing competitors",
      "A check of your site's readiness for storm-season search spikes",
      "Specific, prioritized recommendations — not a generic report",
    ],
    faqs: [
      { question: "Is this audit really free?", answer: "Yes — there's no cost and no obligation to work with us afterward." },
      { question: "Do you only work with roofing companies?", answer: "No, but we've researched the Texas roofing market specifically, so this audit is tailored to the search behavior and competition roofing companies actually face." },
    ],
  },
  "hvac-companies-florida": {
    slug: "hvac-companies-florida",
    headline: "A Free Local SEO Audit for Florida HVAC Companies",
    subheadline:
      "See where your HVAC business stands against local competitors in Miami, Tampa, and Orlando ahead of peak cooling season.",
    audience: "Florida HVAC companies",
    metaTitle: "Free SEO Audit for Florida HVAC Companies",
    metaDescription: "A free, no-obligation local SEO audit built specifically for Florida HVAC companies competing for emergency repair and maintenance-plan searches.",
    offerPoints: [
      "A review of your Google Business Profile against top-ranking Florida HVAC competitors",
      "A check of your site's mobile speed for emergency, roadside-style searches",
      "Specific, prioritized recommendations — not a generic report",
    ],
    faqs: [
      { question: "Is this audit really free?", answer: "Yes — there's no cost and no obligation to work with us afterward." },
      { question: "How is this different from a generic SEO tool report?", answer: "This is a manual review by our team, built around what we've seen actually move rankings for HVAC companies in Florida specifically." },
    ],
  },
  "plumbers-arizona": {
    slug: "plumbers-arizona",
    headline: "A Free Local SEO Audit for Arizona Plumbing Companies",
    subheadline:
      "See exactly where your plumbing business is losing Map Pack visibility across Phoenix and Scottsdale.",
    audience: "Arizona plumbing companies",
    metaTitle: "Free SEO Audit for Arizona Plumbing Companies",
    metaDescription: "A free, no-obligation local SEO audit built specifically for Arizona plumbing companies competing for emergency and routine plumbing searches.",
    offerPoints: [
      "A review of your Google Business Profile against top-ranking Phoenix-area plumbing competitors",
      "A check of your review velocity and response consistency",
      "Specific, prioritized recommendations — not a generic report",
    ],
    faqs: [
      { question: "Is this audit really free?", answer: "Yes — there's no cost and no obligation to work with us afterward." },
      { question: "Do you work with plumbing companies outside Phoenix and Scottsdale?", answer: "Yes — this audit is tailored to the Phoenix metro, but we work with plumbing companies across Arizona and the wider US." },
    ],
  },
};
