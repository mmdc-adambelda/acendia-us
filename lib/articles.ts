export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  readTime: string;
  published: boolean;
};

// The first live article proves the template; the rest are briefs slated
// for the next content pass (see deliverables report for full briefs).
export const ARTICLES: Article[] = [
  {
    slug: "local-seo-checklist-for-us-small-businesses",
    title: "The Local SEO Checklist Every US Small Business Should Run Quarterly",
    description:
      "What is local SEO, and how do you check it's working? A practical local SEO checklist covering Google Business Profile, citations, and Map Pack rankings.",
    publishedAt: "2026-07-15",
    readTime: "11 min read",
    published: true,
  },
  {
    slug: "google-business-profile-optimization-mistakes",
    title: "7 Google Business Profile Mistakes Costing US Businesses Local Leads",
    description: "Common, fixable errors that quietly suppress Map Pack visibility.",
    publishedAt: "2026-08-01",
    readTime: "7 min read",
    published: true,
  },
  {
    slug: "technical-seo-audit-checklist",
    title: "What Actually Belongs in a Technical SEO Audit in 2026",
    description: "Beyond broken links: crawl budget, indexation, and Core Web Vitals priorities.",
    publishedAt: "2026-08-06",
    readTime: "10 min read",
    published: true,
  },
  {
    slug: "how-seo-works-and-generates-organic-leads",
    title: "How SEO Works — and How It Actually Turns Into Organic Leads",
    description:
      "Rankings aren't the goal — leads are. A clear breakdown of how SEO actually moves a business from invisible to found, and found into booked.",
    publishedAt: "2026-08-22",
    readTime: "12 min read",
    published: true,
  },
  {
    slug: "why-seo-is-important-for-startups-and-mid-size-businesses",
    title: "Why SEO Is Important for Startups and Mid-Size Businesses",
    description:
      "Why SEO is the one growth channel that gets cheaper over time instead of more expensive — and why waiting until you need leads is too late.",
    publishedAt: "2026-08-22",
    readTime: "10 min read",
    published: true,
  },
];
