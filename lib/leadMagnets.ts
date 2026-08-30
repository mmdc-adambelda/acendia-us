// Reusable lead-magnet config. Adding the next lead magnet (e.g.
// /free-local-seo-guide/, /free-gbp-checklist/) should mean: add one entry
// here, drop the PDF in private-assets/lead-magnets/, and add one thin
// route folder (app/<slug>/page.tsx + app/<slug>/thank-you/page.tsx) that
// renders the shared components with this config — not rebuilding the
// form, email, download-gating, or analytics wiring, which are all
// slug-parameterized (see app/api/lead-magnets/[slug]/*).

export type LeadMagnet = {
  slug: string;
  path: string; // always trailing-slash, e.g. "/free-seo-ebook/"
  name: string; // human name, used in emails/schema — not shown as page copy verbatim
  fileName: string; // filename the visitor's browser saves the download as
  filePath: string; // path to the PDF relative to the repo root, OUTSIDE public/
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  hero: {
    eyebrow: string;
    title: string;
    supporting: string;
    ctaLabel: string;
    trustStatement: string;
  };
  valuePoints: string[];
  whoShouldDownload: string[];
  form: {
    ctaLabel: string;
    consentText: string;
  };
  unlock: {
    eyebrow: string;
    headline: string;
    supporting: string;
    downloadLabel: string;
  };
  postDownload: {
    headline: string;
    body: string;
    ctaLabel: string;
    bookingUrl: string;
  };
};

export const LEAD_MAGNETS: Record<string, LeadMagnet> = {
  "free-seo-ebook": {
    slug: "free-seo-ebook",
    path: "/free-seo-ebook/",
    name: "The Business Owner's Guide to Improving Your Google Rankings",
    fileName: "Acendia-Business-Owners-Guide-to-On-Page-SEO.pdf",
    filePath: "private-assets/lead-magnets/free-seo-ebook.pdf",
    metaTitle: "Free SEO Ebook — The Business Owner's Guide to Improving Your Google Rankings",
    metaDescription:
      "Download our free SEO guide for business owners — a practical on-page SEO checklist covering search intent, keyword targeting, page structure, and local SEO fundamentals.",
    keywords: [
      "free SEO ebook",
      "SEO ebook for business owners",
      "free SEO guide",
      "on-page SEO guide",
      "SEO checklist",
      "how to improve Google rankings",
      "SEO for small businesses",
    ],
    hero: {
      eyebrow: "FREE SEO EBOOK",
      title: "The Business Owner's Guide to Improving Your Google Rankings",
      supporting:
        "Learn the essential on-page SEO strategies businesses can use to improve search visibility, attract qualified traffic, and build a stronger foundation for organic growth.",
      ctaLabel: "DOWNLOAD THE FREE SEO EBOOK",
      trustStatement: "Free guide. No obligation. Practical SEO knowledge for business owners.",
    },
    valuePoints: [
      "Search intent and keyword targeting",
      "Title tags and meta descriptions",
      "H1/H2 structure and content optimization",
      "Internal linking",
      "Image optimization",
      "URL structure",
      "Local SEO fundamentals",
      "Common SEO mistakes",
      "What professional SEO audits uncover",
    ],
    whoShouldDownload: [
      "Small business owners",
      "Startup founders",
      "Entrepreneurs",
      "CEOs",
      "Marketing managers",
      "Local businesses",
      "Service businesses",
      "Professional services firms",
      "Home service companies",
      "Healthcare businesses",
      "Law firms",
      "Accounting firms",
      "Real estate businesses",
      "B2B companies",
    ],
    form: {
      ctaLabel: "GET MY FREE SEO EBOOK",
      consentText:
        "By submitting this form, you agree to be contacted by Acendia International about your SEO and marketing needs. See our Privacy Policy for details.",
    },
    unlock: {
      eyebrow: "FREE SEO EBOOK",
      headline: "Your SEO Ebook Is Ready",
      supporting: "Thanks for requesting the Acendia SEO Guide. Your copy is ready below.",
      downloadLabel: "DOWNLOAD THE EBOOK",
    },
    postDownload: {
      headline: "Now Find Out What Your Website Is Missing",
      body: "This guide gives you the fundamentals of on-page SEO. But every website has different opportunities.\n\nYour competitors, technical SEO, keyword targeting, content, local visibility, website performance and conversion paths all influence your ability to generate organic growth.\n\nAcendia can analyze your website and identify the opportunities that matter most.",
      ctaLabel: "GET MY FREE SEO AUDIT",
      bookingUrl:
        "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1k9VHI-pmQkkT9XZIwheJi3eWalZmBjNK-1W_aTZtJsN4qL8l3illVj_NSO0lZlNnAvHFcUnCX",
    },
  },
};

export function getLeadMagnet(slug: string): LeadMagnet | undefined {
  return LEAD_MAGNETS[slug];
}
