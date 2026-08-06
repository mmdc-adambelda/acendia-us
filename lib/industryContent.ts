export type IndustryPageContent = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  challenges: { title: string; body: string }[];
  howCustomersSearch: string;
  seoOpportunities: string[];
  gbpOpportunities: string[];
  conversionOpportunities: string[];
  contentStrategy: string[];
  states: string[];
  recommendedServices: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
};

export const INDUSTRY_CONTENT: Record<string, IndustryPageContent> = {
  "home-services": {
    slug: "home-services",
    name: "Home Services",
    metaTitle: "SEO for Home Services Companies | Acendia",
    metaDescription:
      "SEO and local marketing strategy for home services businesses — roofing, HVAC, plumbing, electrical, restoration, and more — competing for local jobs across the US.",
    heroDescription:
      "Roofers, HVAC contractors, plumbers, and electricians all compete for the same thing: being the business a nearby customer calls first when something breaks.",
    challenges: [
      { title: "Emergency-driven search", body: "A large share of home services searches happen in the moment of need, where Map Pack position and phone-answer speed decide who gets the job." },
      { title: "Seasonal and weather-driven demand", body: "Storm damage, extreme heat, and cold snaps create sudden demand spikes that businesses with weak local visibility largely miss." },
      { title: "Crowded, high-spend local competition", body: "Home services categories are among the most competitive in local search and paid ads, making organic visibility a meaningful cost advantage over time." },
    ],
    howCustomersSearch:
      "Home services searches skew heavily local and urgent — \"emergency plumber near me,\" \"[city] roof repair,\" \"AC not cooling [city]\" — with Google Business Profile and Map Pack results often winning the click before a single organic result is seen.",
    seoOpportunities: [
      "Service + city page architecture matched to actual service area",
      "Technical SEO to support fast load times on mobile, where most emergency searches happen",
      "Local link building through industry associations and supplier directories",
      "Content addressing seasonal demand spikes ahead of the season",
    ],
    gbpOpportunities: [
      "Complete, accurate service and category structure",
      "Photo documentation of completed jobs",
      "Consistent review generation tied to job completion",
      "Regular posts around seasonal service reminders",
    ],
    conversionOpportunities: [
      "Prominent, always-visible phone CTA on mobile",
      "Simple, fast quote request forms",
      "Trust signals (licensing, insurance, years in business) above the fold",
    ],
    contentStrategy: [
      "Seasonal maintenance guides tied to specific service categories",
      "Cost and pricing transparency content (a top search driver in this category)",
      "Problem-diagnosis content that builds trust before the call",
    ],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
    ],
    faqs: [
      { question: "Which home services categories do you specialize in?", answer: "Roofing, HVAC, plumbing, electrical, and water damage restoration are our primary focus, though the approach applies broadly across home services." },
      { question: "Can you help capture storm-driven demand spikes?", answer: "We can help you build the local visibility and profile strength that puts you in a better position when demand spikes — we can't predict or control specific weather events." },
      { question: "How fast can local SEO impact lead volume for home services?", answer: "Home services local SEO often moves faster than more competitive national categories, though timelines still depend on your starting position and local competition." },
    ],
  },
  "law-firm-seo": {
    slug: "law-firm-seo",
    name: "Law Firm SEO",
    metaTitle: "SEO for Law Firms | Legal SEO Services",
    metaDescription:
      "SEO services built for law firms — personal injury, family law, immigration, and estate planning practices competing for high-value case leads across the US.",
    heroDescription:
      "For most law firms, a single qualified case can fund a substantial share of annual marketing spend — which makes search visibility one of the highest-leverage investments available.",
    challenges: [
      { title: "Extremely high competition and CPC", body: "Practice areas like personal injury see some of the highest-cost paid search competition of any industry, making durable organic visibility especially valuable." },
      { title: "Trust-heavy buying decisions", body: "Legal searches are high-stakes and trust-dependent — thin, generic content or an outdated site undermines credibility before a call even happens." },
      { title: "Strict advertising and ethics constraints", body: "Legal marketing operates under state bar advertising rules, which require careful, accurate claims rather than the aggressive language common in other industries." },
    ],
    howCustomersSearch:
      "Legal searches range from broad (\"personal injury lawyer [city]\") to highly specific situational queries (\"what to do after a rear-end collision in Texas\"), with a significant share of traffic going to firms that answer the specific situational question clearly, not just the ones bidding highest on ads.",
    seoOpportunities: [
      "Practice-area pages built around genuine search intent, not generic descriptions",
      "Technical SEO and Core Web Vitals — legal sites are frequently slow and hurt by this",
      "Structured data supporting rich results for legal services",
      "Local SEO for firms with multiple office locations",
    ],
    gbpOpportunities: [
      "Accurate practice area and attorney profile structure",
      "Consistent, ethics-compliant review response management",
      "Location-specific profiles for multi-office firms",
    ],
    conversionOpportunities: [
      "Clear, low-friction case evaluation request forms",
      "Prominent attorney credentials and case-type specificity",
      "Fast-loading, mobile-first practice area pages",
    ],
    contentStrategy: [
      "Situational guides answering \"what do I do if...\" queries specific to each practice area",
      "Process-explainer content demystifying what happens after a client calls",
      "State-specific legal process content where laws and timelines vary by state",
    ],
    states: ["California", "Texas", "Florida", "New York", "Illinois", "New Jersey", "Pennsylvania", "Georgia"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Website Development", href: "/services/website-development/" },
    ],
    faqs: [
      { question: "Do you guarantee case leads or rankings?", answer: "No — we don't and can't guarantee specific rankings or case volume. We build a documented strategy and report transparently on what's actually happening." },
      { question: "Do you work with firms across multiple practice areas?", answer: "Yes, though each practice area typically needs its own dedicated page and content strategy rather than being lumped into one generic services page." },
      { question: "Are you familiar with legal advertising rules?", answer: "We write content designed to be accurate and avoid overreaching claims, but your firm's compliance team or bar association guidance should always be the final check on legal marketing claims." },
    ],
  },
};
