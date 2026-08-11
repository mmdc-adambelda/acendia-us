export type IndustryPageContent = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  heroImage?: { src: string; alt: string };
  /** Icon shown as a placeholder hero when heroImage isn't set yet —
   * name must exist in ICON_MAP (components/icons.tsx). */
  icon: string;
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
    icon: "layout",
    name: "Home Services",
    metaTitle: "SEO for Home Services Companies",
    metaDescription:
      "SEO and local marketing strategy for home services businesses — roofing, HVAC, plumbing, electrical, restoration, and more — competing for local jobs across the US.",
    heroDescription:
      "Roofers, HVAC contractors, plumbers, and electricians all compete for the same thing: being the business a nearby customer calls first when something breaks.",
    heroImage: {
      src: "/images/us-home-services-team-onsite.webp",
      alt: "US home services technician inspecting a rooftop HVAC unit on a suburban house",
    },
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
    icon: "badge-check",
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

  "healthcare": {
    slug: "healthcare",
    icon: "sparkles",
    name: "Healthcare & Aesthetics",
    metaTitle: "SEO for Healthcare, Dental & Med Spa Practices",
    metaDescription:
      "SEO and local marketing for dental, medical, and med spa practices — built around how US patients actually search for and choose a provider.",
    heroDescription:
      "Patients research providers online before they ever call — practices with weak search visibility lose new-patient volume to competitors with stronger profiles, not necessarily better care.",
    challenges: [
      { title: "Trust-first decisions", body: "Patients weigh reviews, credentials, and site professionalism heavily before booking, especially for elective or aesthetic procedures." },
      { title: "Insurance and compliance constraints", body: "Content needs to be accurate about services, pricing, and outcomes without making unsupported medical claims." },
      { title: "Multi-provider profile complexity", body: "Practices with several providers need individual and practice-level visibility without diluting either." },
    ],
    howCustomersSearch:
      "Searches range from symptom-based (\"tooth pain relief [city]\") to provider-comparison queries (\"best dermatologist near me\") and highly specific procedure searches, with reviews and Map Pack position both weighing heavily on which practice gets the call.",
    seoOpportunities: [
      "Service-specific pages for each treatment or specialty offered",
      "Local SEO tuned to how patients search by symptom and by procedure",
      "Technical SEO and site speed, since patient-facing sites are often built on slow, plugin-heavy platforms",
      "Structured data supporting rich results for medical and dental services",
    ],
    gbpOpportunities: [
      "Accurate specialty and service structure across providers",
      "Consistent, compliant review response management",
      "Photo documentation of the practice and team",
    ],
    conversionOpportunities: [
      "Simple, low-friction appointment request forms",
      "Clear insurance and new-patient information above the fold",
      "Fast-loading, mobile-first service pages",
    ],
    contentStrategy: [
      "Procedure and treatment explainer content addressing common patient questions",
      "New-patient guides covering what to expect at a first visit",
      "Condition-specific content connecting symptoms to relevant services",
    ],
    states: ["Florida", "California", "Texas", "New York", "Arizona", "New Jersey", "North Carolina"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Website Design", href: "/services/website-design/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
    ],
    faqs: [
      { question: "Can you make medical claims in our content?", answer: "We write content that describes services and outcomes accurately and avoids unsupported or exaggerated claims — any specific clinical language should still be reviewed by your practice." },
      { question: "Do you handle multi-provider practices?", answer: "Yes — we build both practice-level and individual provider visibility so multi-provider practices don't have internal pages competing with each other." },
      { question: "Is this different for med spas versus medical practices?", answer: "The core approach is similar, but med spas typically lean more heavily on visual content and aesthetic-outcome search intent, while medical practices lean more on symptom and insurance-related search intent." },
    ],
  },

  "real-estate": {
    slug: "real-estate",
    icon: "map-pin",
    name: "Real Estate & Property",
    metaTitle: "SEO for Real Estate & Property Management Companies",
    metaDescription:
      "SEO services for real estate agencies, property managers, and brokers competing for local visibility in specific US neighborhoods and markets.",
    heroDescription:
      "Real estate search is hyper-local and highly competitive — visibility for a specific neighborhood or property type is often more valuable than ranking for a broad city term.",
    challenges: [
      { title: "Extreme local competition", body: "Large national portals and hundreds of local agents compete for the same neighborhood-level searches." },
      { title: "Content that goes stale fast", body: "Listing-driven content ages quickly, and market data needs regular updates to stay useful and credible." },
      { title: "Property managers need a different funnel", body: "Owner-facing lead generation for property management is a distinct search intent from buyer/renter-facing content." },
    ],
    howCustomersSearch:
      "Buyers and renters search by neighborhood and property type (\"homes for sale in [neighborhood]\"), while property owners search more transactionally (\"best property management company [city]\") — these are different funnels that shouldn't be collapsed into one page.",
    seoOpportunities: [
      "Neighborhood-specific content beyond generic city landing pages",
      "Local SEO and Google Business Profile optimization for brokerages and management companies",
      "Separate content tracks for buyer/renter intent versus owner/investor intent",
      "Technical SEO for listing-heavy sites prone to duplicate content and crawl budget issues",
    ],
    gbpOpportunities: [
      "Accurate service area and specialty structure (residential, commercial, property management)",
      "Consistent review generation from closed transactions",
      "Regular posts highlighting market activity",
    ],
    conversionOpportunities: [
      "Clear owner-facing lead capture separate from buyer/renter capture",
      "Fast, mobile-first property and neighborhood pages",
      "Simple valuation or consultation request forms",
    ],
    contentStrategy: [
      "Neighborhood guides with genuine local detail, not generic city overviews",
      "Market update content for both buyers and owners",
      "Property management-specific content addressing owner pain points",
    ],
    states: ["Florida", "Texas", "California", "Arizona", "Georgia", "North Carolina", "Nevada", "Tennessee"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
    ],
    faqs: [
      { question: "Do you work with both agents and property management companies?", answer: "Yes, though we treat them as distinct funnels with different content and conversion paths rather than one blended strategy." },
      { question: "How do you handle MLS/listing content duplication?", answer: "We build supporting content and page architecture designed to avoid duplicate-content conflicts with syndicated listing data." },
      { question: "Can this help with investor-owner leads specifically?", answer: "Yes — property management and investment-focused content is built as its own track separate from buyer/renter-facing pages." },
    ],
  },

  "moving-and-logistics": {
    slug: "moving-and-logistics",
    icon: "layers",
    name: "Moving & Logistics",
    metaTitle: "SEO for Moving Companies & Logistics Businesses",
    metaDescription:
      "SEO and local marketing for moving companies, storage providers, and logistics businesses competing against national lead-gen platforms for direct bookings.",
    heroDescription:
      "Moving companies often lose margin to third-party lead marketplaces — strong organic and local visibility is one of the clearest paths to more direct, higher-margin bookings.",
    challenges: [
      { title: "Lead marketplace dependence", body: "Many movers rely heavily on paid lead platforms that take a cut of every job and control the customer relationship." },
      { title: "Seasonal demand concentration", body: "Summer months and month-end dates drive outsized demand, and visibility needs to be strong before the season starts." },
      { title: "Trust deficit in the category", body: "The moving industry has a reputation problem — visible, consistent reviews matter more here than in many other categories." },
    ],
    howCustomersSearch:
      "Searches are highly transactional and often route-based (\"movers from [city] to [city]\" or \"local movers near me\"), with review count and rating frequently deciding which of several similarly-priced quotes gets chosen.",
    seoOpportunities: [
      "Local and route-specific service pages (in-city moves versus long-distance routes)",
      "Local SEO built to reduce dependence on paid lead marketplaces over time",
      "Content addressing the trust deficit directly (licensing, insurance, process transparency)",
      "Technical SEO to support fast quote-request flows",
    ],
    gbpOpportunities: [
      "Complete profile with licensing and insurance information visible",
      "Consistent review generation immediately after job completion",
      "Photo documentation building visual trust",
    ],
    conversionOpportunities: [
      "Fast, simple quote request forms",
      "Transparent pricing or estimate information where possible",
      "Prominent trust signals (licensing, insurance, years in business)",
    ],
    contentStrategy: [
      "Moving checklists and guides tied to specific routes or seasons",
      "Transparent pricing and process content addressing common objections",
      "Storage and specialty-move content (long-distance, commercial, senior moving)",
    ],
    states: ["Texas", "Florida", "California", "New York", "Illinois", "Georgia", "North Carolina", "Arizona"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Lead Generation", href: "/services/lead-generation/" },
      { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization/" },
    ],
    faqs: [
      { question: "Can this reduce our dependence on paid lead platforms?", answer: "Building strong organic and local visibility is the main lever for this — it takes time, but it builds an asset you own instead of renting leads indefinitely." },
      { question: "Do you cover long-distance and local moves differently?", answer: "Yes — these are different search intents and typically need separate page structures rather than one blended moving-services page." },
      { question: "How important are reviews in this industry specifically?", answer: "Very — moving is a high-trust-deficit category, so review volume, recency, and response quality carry more ranking and conversion weight than in many other industries." },
    ],
  },

  "automotive": {
    slug: "automotive",
    icon: "cpu",
    name: "Automotive Services",
    metaTitle: "SEO for Auto Repair, Towing & Detailing Businesses",
    metaDescription:
      "SEO and local marketing for auto repair shops, towing companies, and detailing businesses competing for local, often urgent, automotive service searches.",
    heroDescription:
      "From breakdowns to routine maintenance, automotive searches are frequently urgent and hyper-local — the shop that shows up first on mobile usually wins the call.",
    challenges: [
      { title: "Urgent, mobile-first search behavior", body: "Towing and breakdown searches happen on a phone, often roadside, where speed and clarity of information decide the click." },
      { title: "Category price-shopping", body: "Routine service searches (\"oil change near me\") are heavily price- and review-driven, with thin differentiation between competitors." },
      { title: "Franchise competition", body: "National chains often outspend independent shops on paid visibility, making organic and local SEO a proportionally bigger lever for independents." },
    ],
    howCustomersSearch:
      "Automotive searches split between urgent (\"tow truck near me now\") and planned (\"brake repair [city] reviews\"), with the urgent segment weighing Map Pack proximity and phone-answer speed most heavily, and the planned segment weighing reviews and pricing transparency.",
    seoOpportunities: [
      "Service-specific local pages (brakes, transmission, towing, detailing)",
      "Local SEO tuned for both urgent and planned search behavior",
      "Google Business Profile optimization with accurate service and hours data",
      "Technical SEO for fast mobile load times, critical for roadside searches",
    ],
    gbpOpportunities: [
      "Accurate hours, especially for shops offering after-hours or emergency service",
      "Service-specific categories and attributes",
      "Consistent review generation tied to service completion",
    ],
    conversionOpportunities: [
      "One-tap call button prominent on mobile",
      "Simple appointment or estimate request forms",
      "Transparent, easy-to-find pricing where competitive",
    ],
    contentStrategy: [
      "Maintenance guides tied to specific services and seasons",
      "Pricing transparency content addressing a top search driver in this category",
      "Trust-building content (certifications, warranty information, technician expertise)",
    ],
    states: ["Texas", "Florida", "California", "Arizona", "Georgia", "North Carolina", "Illinois", "New York"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Website Development", href: "/services/website-development/" },
    ],
    faqs: [
      { question: "How do you handle urgent, roadside search traffic?", answer: "We prioritize mobile speed, prominent click-to-call, and accurate hours and location data, since urgent searches convert almost entirely on those factors." },
      { question: "Can independents compete with franchise chains here?", answer: "Local and organic SEO is proportionally more valuable for independents since chains often win on paid spend but not necessarily on genuine local relevance and reviews." },
      { question: "Do you help with multiple service categories under one shop?", answer: "Yes — we build separate service pages for each major category (brakes, towing, detailing, etc.) rather than one generic services page." },
    ],
  },

  "professional-services": {
    slug: "professional-services",
    icon: "target",
    name: "Professional & B2B Services",
    metaTitle: "SEO for Accounting, IT & Professional Services Firms",
    metaDescription:
      "SEO and content strategy for accounting firms, managed IT providers, staffing agencies, and other B2B professional services firms building trust before a contract.",
    heroDescription:
      "Professional services buyers do extensive research before ever reaching out — search visibility and content depth often substitute for the referral that used to close the deal.",
    challenges: [
      { title: "Long, research-heavy sales cycles", body: "B2B buyers read multiple pages of content before contacting a firm, so thin service pages lose consideration before a conversation even starts." },
      { title: "Trust built through expertise signals", body: "Credentials, case studies, and specific expertise matter more here than in consumer-facing local categories." },
      { title: "Niche service differentiation", body: "Generic \"IT services\" or \"accounting services\" pages struggle to rank against firms with more specific, keyword-aligned service pages." },
    ],
    howCustomersSearch:
      "Searches range from broad category terms (\"managed IT provider near me\") to highly specific pain-point queries (\"outsourced bookkeeping for small business\"), with buyers often researching for weeks before submitting a contact form.",
    seoOpportunities: [
      "Specific, niche service pages instead of one generic services page",
      "Content addressing buyer research questions at each funnel stage",
      "Local SEO for firms serving a defined regional market",
      "Technical SEO and site credibility signals (speed, security, professionalism)",
    ],
    gbpOpportunities: [
      "Accurate service and specialty categories",
      "Client testimonials and case studies where approved for sharing",
      "Consistent activity signals through regular posts",
    ],
    conversionOpportunities: [
      "Clear, low-commitment first-step CTAs (consultation, assessment) rather than only \"contact us\"",
      "Case studies and credentials placed prominently",
      "Fast-loading, professional site design that builds credibility",
    ],
    contentStrategy: [
      "Buyer-research content addressing specific pain points and comparisons",
      "Case studies and process explainers building expertise credibility",
      "Niche service pages targeting specific, less-competitive search terms",
    ],
    states: ["Texas", "Florida", "California", "New York", "Illinois", "Georgia", "North Carolina", "Arizona"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "AI Digital Marketing", href: "/services/ai-digital-marketing/" },
    ],
    faqs: [
      { question: "How is B2B SEO different from local consumer SEO?", answer: "B2B buyers typically research longer and value depth and expertise signals more than proximity or reviews alone, so content strategy carries more weight relative to local signals." },
      { question: "Do you write case studies for us?", answer: "We can help structure and write case studies based on results and details your firm provides and approves for publication." },
      { question: "Can you help with a specific niche, like outsourced bookkeeping or cybersecurity?", answer: "Yes — the more specific the niche, the more valuable a dedicated, well-optimized page usually is compared to a broad, generic services page." },
    ],
  },

  "roofing-seo": {
    slug: "roofing-seo",
    icon: "layout",
    name: "Roofing Companies",
    metaTitle: "SEO for Roofing Companies | Roofing SEO Services",
    metaDescription:
      "SEO services for roofing companies — built around storm-driven demand, insurance-claim searches, and the local competition specific to roofing.",
    heroDescription:
      "Roofing demand spikes hard after storms — companies with strong existing local visibility capture disproportionate share of that surge; companies without it largely miss it.",
    challenges: [
      { title: "Storm-driven demand volatility", body: "Search volume for roofing services can spike dramatically after a single weather event, rewarding businesses that already have visibility in place." },
      { title: "Insurance-claim search intent", body: "A large share of roofing searches are tied to insurance claims, which comes with its own trust and process-education needs." },
      { title: "High-value, infrequent purchases", body: "Most homeowners buy a roof once a decade or less, meaning trust signals matter enormously since there's no repeat-customer relationship to lean on." },
    ],
    howCustomersSearch:
      "Searches split between routine (\"roof inspection [city]\") and urgent post-storm (\"emergency roof repair [city]\"), with insurance-claim-related searches (\"roof insurance claim help\") forming a distinct, high-intent segment.",
    seoOpportunities: [
      "Storm-response content prepared ahead of storm season",
      "Insurance claim process content addressing a major search segment",
      "Local SEO across every service area, since roofing crews often cover a wide radius",
      "Technical SEO for fast mobile load during high-urgency search spikes",
    ],
    gbpOpportunities: ["Complete licensing and insurance information", "Before/after photo documentation", "Review generation tied to project completion"],
    conversionOpportunities: ["Fast, simple inspection request forms", "Prominent financing or insurance-claim assistance messaging", "Clear licensing and warranty information"],
    contentStrategy: ["Storm-preparedness and post-storm response guides", "Insurance claim process explainers", "Material and cost transparency content"],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Home Services", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Can you help us prepare for storm-season demand spikes?", answer: "We can strengthen your local visibility and content ahead of storm season so you're better positioned when demand spikes — we can't predict specific weather events." },
      { question: "Do you write insurance-claim content?", answer: "Yes — insurance-claim process content is one of the highest-value content types in this category and we build it as a dedicated section." },
      { question: "How many service areas can this cover?", answer: "As many as your crews genuinely serve — we build out local pages progressively rather than all at once to keep each one substantive." },
    ],
  },
  "hvac-seo": {
    slug: "hvac-seo",
    icon: "cpu",
    name: "HVAC Contractors",
    metaTitle: "SEO for HVAC Companies | HVAC SEO Services",
    metaDescription: "SEO services for HVAC contractors — built around emergency repair searches, seasonal demand, and maintenance-plan lead generation.",
    heroDescription: "HVAC search behavior swings hard between emergency repair and planned maintenance — and each needs a different page, not one blended services page.",
    challenges: [
      { title: "Extreme seasonality", body: "Demand concentrates around temperature extremes, and visibility needs to be established well before peak season." },
      { title: "Emergency vs. maintenance search splits", body: "\"AC not cooling\" and \"HVAC maintenance plan\" are different buyers at different funnel stages." },
      { title: "Maintenance-plan retention opportunity", body: "Recurring maintenance plans are a major recurring-revenue opportunity that's often under-marketed on the website." },
    ],
    howCustomersSearch: "Emergency searches (\"AC repair near me\") spike with weather; planned searches (\"HVAC tune-up\" or \"maintenance plan\") are steadier and more price-comparison driven.",
    seoOpportunities: ["Separate emergency-repair and maintenance-plan pages", "Seasonal content published ahead of peak demand", "Local SEO across full service area", "Technical SEO for fast mobile emergency-search experience"],
    gbpOpportunities: ["Accurate 24/7 or emergency availability data", "Service-specific categories (repair, install, maintenance)", "Review generation tied to service visits"],
    conversionOpportunities: ["Prominent emergency call CTA", "Simple maintenance-plan signup flow", "Clear, upfront service area coverage"],
    contentStrategy: ["Seasonal maintenance guides", "Maintenance-plan value content", "Emergency troubleshooting guides that build trust before the call"],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Lead Generation", href: "/services/lead-generation/" },
      { label: "Home Services", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Do you separate emergency and maintenance content?", answer: "Yes — these are different search intents and funnel stages, and blending them into one page usually underperforms for both." },
      { question: "Can this help grow our maintenance plan subscriptions?", answer: "We can build dedicated content and conversion paths for maintenance plans, which is often an underused recurring-revenue opportunity." },
      { question: "How do you handle seasonal demand swings?", answer: "We build and publish seasonal content ahead of peak months so your visibility is already established before demand spikes." },
    ],
  },
  "plumbing-seo": {
    slug: "plumbing-seo",
    icon: "layout",
    name: "Plumbing Companies",
    metaTitle: "SEO for Plumbing Companies | Plumber SEO Services",
    metaDescription: "SEO services for plumbing companies — built around emergency call volume, Map Pack competition, and local service-area visibility.",
    heroDescription: "Plumbing is one of the most Map-Pack-dependent categories in home services — a strong local profile often matters more than the website itself.",
    challenges: [
      { title: "Emergency call urgency", body: "Burst pipes and major leaks drive time-sensitive searches where Map Pack position and answer speed decide the job." },
      { title: "Dense local competition", body: "Most metro markets have dozens of plumbers already investing in local SEO." },
      { title: "Trust in a historically low-trust category", body: "Plumbing has a reputation trust gap that reviews and transparency help close." },
    ],
    howCustomersSearch: "Overwhelmingly local and urgent (\"emergency plumber near me\", \"[city] plumber same day\"), with Map Pack and reviews deciding most clicks before an organic result is even seen.",
    seoOpportunities: ["Aggressive local SEO and Google Business Profile investment", "Service-specific pages (drain cleaning, water heater, leak repair)", "Local link building through trade associations", "Review generation as a core, ongoing workflow"],
    gbpOpportunities: ["Complete emergency availability and service data", "Consistent, fast review response", "Photo documentation of completed jobs"],
    conversionOpportunities: ["One-tap call CTA prominent throughout", "Simple, fast quote request form", "Upfront trust signals (licensing, insurance)"],
    contentStrategy: ["Problem-diagnosis content that builds trust pre-call", "Pricing transparency content", "Seasonal content (frozen pipes, holiday plumbing issues)"],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Home Services", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Is local SEO more important than the website itself here?", answer: "Local signals typically carry more weight in this category, though a fast, clear website still matters once someone clicks through." },
      { question: "How do you build trust in a low-trust category?", answer: "Consistent, recent reviews, transparent pricing information, and visible licensing/insurance details do most of the trust-building work." },
      { question: "Can you help with 24/7 emergency service visibility?", answer: "Yes — we make sure your profile and content clearly reflect emergency availability, which is a major factor in urgent searches." },
    ],
  },
  "electrician-seo": {
    slug: "electrician-seo",
    icon: "cpu",
    name: "Electrical Contractors",
    metaTitle: "SEO for Electricians | Electrical Contractor SEO",
    metaDescription: "SEO services for electrical contractors — covering emergency service, panel upgrade, and EV charger installation search demand.",
    heroDescription: "Electrical searches range from urgent safety issues to planned upgrade projects, each needing a distinct approach to content and local visibility.",
    challenges: [
      { title: "Safety-driven urgency", body: "Electrical issues often carry a safety concern that drives immediate, high-intent searches." },
      { title: "Growing EV and solar-adjacent demand", body: "EV charger installation and panel upgrade searches are a growing, often underserved content opportunity." },
      { title: "Licensing and trust signals matter heavily", body: "Electrical work has real safety stakes, making licensing and certification visibility especially important." },
    ],
    howCustomersSearch: "A mix of urgent (\"electrician near me emergency\") and project-based (\"panel upgrade cost\", \"EV charger installation [city]\") searches, with the latter segment often under-targeted by competitors.",
    seoOpportunities: ["Dedicated pages for panel upgrades, EV chargers, and rewiring projects", "Local SEO for emergency service visibility", "Content addressing safety and licensing questions", "Technical SEO for fast mobile experience"],
    gbpOpportunities: ["Accurate licensing and certification display", "Service-specific categories", "Review generation tied to project completion"],
    conversionOpportunities: ["Clear emergency call CTA", "Simple project quote request form", "Prominent licensing/certification trust signals"],
    contentStrategy: ["EV charger and panel upgrade guides — a growing, underserved search segment", "Electrical safety content", "Cost transparency content for common projects"],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Home Services", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Do you build pages for EV charger installation specifically?", answer: "Yes — this is a growing search category we treat as its own dedicated page rather than folding into general electrical services." },
      { question: "How important is licensing information for SEO here?", answer: "Very — beyond trust, licensing and certification details support both conversion and the credibility signals search engines and patients (well, customers) look for." },
      { question: "Can you help with emergency service visibility?", answer: "Yes, similar to our approach for plumbing and HVAC — accurate profile data and fast-loading mobile pages are key for urgent searches." },
    ],
  },
  "restoration-company-seo": {
    slug: "restoration-company-seo",
    icon: "layout",
    name: "Water Damage & Restoration Companies",
    metaTitle: "SEO for Restoration Companies | Water Damage SEO",
    metaDescription: "SEO services for water damage, fire damage, and mold remediation companies — built around urgent, insurance-driven search demand.",
    heroDescription: "Restoration searches are almost always urgent and insurance-adjacent — the company that answers fastest and shows up first usually gets the job.",
    challenges: [
      { title: "24/7 urgency expectations", body: "Water and fire damage searches happen at all hours, and visibility plus fast response define the category." },
      { title: "Insurance-process complexity", body: "Most jobs involve an insurance claim, and customers search for help navigating that process as much as the restoration work itself." },
      { title: "Event-driven demand spikes", body: "Storms and flooding create sudden surges that reward businesses with existing visibility." },
    ],
    howCustomersSearch: "Highly urgent, local, and often includes insurance language (\"water damage restoration near me\", \"mold remediation insurance claim\"), with 24/7 availability signals directly affecting which business gets the call.",
    seoOpportunities: ["24/7 availability prominently reflected in local SEO signals", "Insurance-process content addressing a major search segment", "Storm-response content prepared ahead of severe weather season", "Local SEO across full disaster-response service radius"],
    gbpOpportunities: ["Clear 24/7 emergency availability", "Before/after project documentation", "Fast review response given the emotional nature of these jobs"],
    conversionOpportunities: ["One-tap emergency call CTA", "Simple, fast damage assessment request form", "Clear insurance-assistance messaging"],
    contentStrategy: ["Insurance claim navigation guides", "Storm and flood preparedness content", "Mold and water damage prevention content"],
    states: ["Texas", "Florida", "Arizona", "Georgia", "North Carolina", "Tennessee", "California", "Nevada"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Home Services", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "How do you handle 24/7 emergency positioning?", answer: "We make sure your Google Business Profile, schema, and content clearly and accurately reflect real availability, which strongly influences urgent local search results." },
      { question: "Can you write insurance-claim guidance content?", answer: "Yes — this is one of the highest-value content areas in restoration, since customers actively search for help understanding the claims process." },
      { question: "Do you help with storm-season preparation?", answer: "We help strengthen visibility and content ahead of storm season so you're well-positioned when demand spikes — we can't predict specific events." },
    ],
  },
  "personal-injury-lawyer-seo": {
    slug: "personal-injury-lawyer-seo",
    icon: "badge-check",
    name: "Personal Injury Law Firms",
    metaTitle: "SEO for Personal Injury Lawyers | PI Law Firm SEO",
    metaDescription: "SEO services for personal injury law firms competing in one of the most expensive, high-value search categories in the country.",
    heroDescription: "Personal injury is among the most competitive and highest-value search categories in the US — durable organic visibility is a meaningful edge against firms relying purely on paid spend.",
    challenges: [
      { title: "Extreme paid search cost", body: "PI keywords are among the most expensive in any category, making organic visibility disproportionately valuable long-term." },
      { title: "Case-type specificity matters", body: "Auto accident, slip-and-fall, and workplace injury searches are distinct intents that deserve distinct pages." },
      { title: "High emotional stakes", body: "Clients are often searching during a stressful period, and content needs to be clear, direct, and genuinely reassuring." },
    ],
    howCustomersSearch: "Searches combine case type and location (\"car accident lawyer [city]\") with situational questions (\"what to do after a car accident\"), and firms answering the situational question clearly often earn trust before the case-type page is even reached.",
    seoOpportunities: ["Dedicated pages per case type (auto, slip-and-fall, workplace, wrongful death)", "Situational guide content answering \"what do I do now\" queries", "Technical SEO — PI sites are frequently slow and content-thin relative to their competitiveness", "Local SEO for firms with multiple office locations"],
    gbpOpportunities: ["Accurate practice area and attorney profile structure", "Ethics-compliant review response management", "Location-specific profiles for multi-office firms"],
    conversionOpportunities: ["Simple, prominent free case evaluation request", "Clear contingency-fee messaging where applicable", "Fast-loading, mobile-first case-type pages"],
    contentStrategy: ["\"What to do after a [case type]\" situational guides", "Process-explainer content demystifying the legal process", "State-specific statute of limitations and process content"],
    states: ["California", "Texas", "Florida", "New York", "Illinois", "New Jersey", "Pennsylvania", "Georgia"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Law Firm SEO", href: "/industries/law-firm-seo/" },
    ],
    faqs: [
      { question: "How competitive is personal injury SEO really?", answer: "Extremely — it's one of the most expensive categories in paid search anywhere, which is exactly why durable organic visibility has such long-term value here." },
      { question: "Do you separate content by case type?", answer: "Yes — auto accidents, slip-and-falls, and workplace injuries are distinct search intents that each deserve their own dedicated, specific page." },
      { question: "Can you guarantee case volume?", answer: "No — no agency can ethically or honestly guarantee case volume. We build a documented strategy and report transparently on what's actually happening." },
    ],
  },
  "family-law-seo": {
    slug: "family-law-seo",
    icon: "badge-check",
    name: "Family Law Firms",
    metaTitle: "SEO for Family Law Firms | Divorce Attorney SEO",
    metaDescription: "SEO services for family law and divorce attorneys — built around sensitive, research-heavy search behavior specific to this practice area.",
    heroDescription: "Family law clients often research extensively and privately before ever contacting a firm — content that answers real questions builds trust before the first call.",
    challenges: [
      { title: "Highly sensitive, private search behavior", body: "Clients often research quietly, sometimes on personal devices away from shared accounts, before reaching out." },
      { title: "Broad practice area range", body: "Divorce, custody, adoption, and prenups are distinct searches that a single generic page can't serve well." },
      { title: "Emotional trust matters as much as expertise", body: "Tone and clarity in content often matter as much as credentials in this practice area." },
    ],
    howCustomersSearch: "Searches range from broad (\"divorce lawyer [city]\") to specific situational questions (\"how does custody work in [state]\"), with state-specific process questions forming a significant, often underserved search segment.",
    seoOpportunities: ["Dedicated pages per sub-practice-area (divorce, custody, adoption, prenups)", "State-specific process content, since family law varies significantly by state", "Content written with a calm, clear, non-adversarial tone", "Local SEO for firms serving specific counties or regions"],
    gbpOpportunities: ["Accurate sub-practice-area structure", "Discreet, ethics-compliant review management", "Consistent profile activity signals"],
    conversionOpportunities: ["Low-pressure, private-feeling consultation request forms", "Clear, calm messaging throughout the site", "Fast-loading, mobile-first pages given sensitive on-the-go research"],
    contentStrategy: ["State-specific custody and divorce process guides", "\"What to expect\" content for each sub-practice-area", "Sensitive-topic FAQ content addressing common private concerns"],
    states: ["California", "Texas", "Florida", "New York", "Illinois", "New Jersey", "Pennsylvania", "Georgia"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Law Firm SEO", href: "/industries/law-firm-seo/" },
    ],
    faqs: [
      { question: "How do you handle the sensitivity of this practice area in content?", answer: "We write in a calm, clear, non-adversarial tone focused on answering real questions rather than aggressive marketing language, which tends to build more trust in this category." },
      { question: "Do state-specific laws affect the content strategy?", answer: "Yes significantly — family law process and terminology vary by state, so content needs to reflect your specific state's process accurately." },
      { question: "Can you cover multiple sub-practice areas on one site?", answer: "Yes — we build dedicated pages for each (divorce, custody, adoption, prenups) rather than one generic family law page." },
    ],
  },
  "dental-seo": {
    slug: "dental-seo",
    icon: "sparkles",
    name: "Dental Practices",
    metaTitle: "SEO for Dental Practices | Dentist SEO Services",
    metaDescription: "SEO services for general and cosmetic dental practices competing for new-patient visibility in local search.",
    heroDescription: "New-patient acquisition for dental practices increasingly starts with a local search and a quick scan of reviews before a call is ever made.",
    challenges: [
      { title: "High local competition", body: "Most metro areas have dozens of dental practices already investing in local SEO and paid ads." },
      { title: "Cosmetic vs. general intent split", body: "\"Emergency dentist\" and \"teeth whitening\" searches represent very different patients with different funnels." },
      { title: "Insurance and new-patient friction", body: "Unclear insurance information is a common reason prospective patients bounce before booking." },
    ],
    howCustomersSearch: "Ranges from urgent (\"emergency dentist near me\") to cosmetic and elective (\"veneers cost [city]\") to routine (\"family dentist accepting new patients\"), each representing a distinct funnel stage.",
    seoOpportunities: ["Dedicated pages for general, cosmetic, and emergency dental services", "Local SEO and Google Business Profile optimization for new-patient capture", "Content addressing insurance and new-patient questions directly", "Technical SEO for fast, mobile-first booking flows"],
    gbpOpportunities: ["Accurate new-patient and insurance information", "Photo documentation of the practice and team", "Consistent review generation from completed visits"],
    conversionOpportunities: ["Simple online appointment request", "Clear insurance and new-patient information above the fold", "Fast-loading mobile experience"],
    contentStrategy: ["Procedure explainer content (whitening, veneers, implants)", "New-patient and insurance FAQ content", "Emergency dental guidance content"],
    states: ["Florida", "California", "Texas", "New York", "Arizona", "New Jersey", "North Carolina"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Healthcare & Aesthetics", href: "/industries/healthcare/" },
    ],
    faqs: [
      { question: "Do you separate cosmetic and general dentistry content?", answer: "Yes — these represent different patient intents and typically convert better with dedicated pages rather than one blended services page." },
      { question: "Can you help with new-patient insurance questions?", answer: "We build clear, accurate insurance and new-patient FAQ content, though your practice should confirm all specific coverage details." },
      { question: "How important are reviews for a dental practice?", answer: "Very — reviews are one of the strongest local trust signals for dental searches, alongside Map Pack position and photo quality." },
    ],
  },
  "med-spa-seo": {
    slug: "med-spa-seo",
    icon: "sparkles",
    name: "Medical Spas & Aesthetics",
    metaTitle: "SEO for Med Spas | Medical Spa SEO Services",
    metaDescription: "SEO services for medical spas and aesthetics practices competing for high-value, visually-driven local search traffic.",
    heroDescription: "Med spa search behavior is heavily visual and trust-dependent — before/after content and reviews often matter as much as the service page itself.",
    challenges: [
      { title: "Visual, trust-heavy decisions", body: "Prospective clients weigh before/after photos and provider credibility heavily before booking." },
      { title: "Fast-evolving treatment menus", body: "New treatments and technologies appear often, and content needs to stay current." },
      { title: "Premium pricing requires premium positioning", body: "Sites and content need to reflect the pricing tier to avoid a credibility mismatch." },
    ],
    howCustomersSearch: "Searches are treatment-specific and comparison-driven (\"best Botox provider [city]\", \"laser hair removal cost\"), with visual proof and reviews weighing heavily in the decision.",
    seoOpportunities: ["Dedicated pages for each major treatment category", "Local SEO and Google Business Profile optimization tuned for visual, premium positioning", "Technical SEO to keep image-heavy pages fast", "Content addressing safety and provider-credential questions"],
    gbpOpportunities: ["High-quality photo documentation", "Consistent review generation", "Accurate treatment and provider credential information"],
    conversionOpportunities: ["Visually strong, fast-loading service pages", "Simple consultation request forms", "Clear provider credentials and safety information"],
    contentStrategy: ["Treatment explainer content with genuine before/after context", "Provider credential and safety content", "Pricing and expectation-setting content"],
    states: ["Florida", "California", "Texas", "New York", "Arizona", "New Jersey", "North Carolina"],
    recommendedServices: [
      { label: "Website Design", href: "/services/website-design/" },
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Healthcare & Aesthetics", href: "/industries/healthcare/" },
    ],
    faqs: [
      { question: "How important are before/after photos for SEO?", answer: "They're primarily a conversion and trust factor rather than a direct ranking factor, but strong visual proof meaningfully improves how well your traffic converts." },
      { question: "Can you help with new treatment launches?", answer: "Yes — we can build dedicated pages for new treatments as your menu evolves, keeping content current with what you actually offer." },
      { question: "Do you address safety and credential questions in content?", answer: "Yes — this is an important trust factor for prospective clients and we build content that addresses it clearly and accurately." },
    ],
  },
  "property-management-seo": {
    slug: "property-management-seo",
    icon: "map-pin",
    name: "Property Management Companies",
    metaTitle: "SEO for Property Management Companies",
    metaDescription: "SEO services for property management companies focused on owner-facing lead generation across specific US markets.",
    heroDescription: "Property management growth depends on owner-facing search visibility — a distinct funnel from tenant-facing rental search that's often under-invested in.",
    challenges: [
      { title: "Owner vs. tenant intent confusion", body: "Many property management sites blend tenant-facing rental listings with owner-facing lead generation, diluting both." },
      { title: "High-value, low-frequency conversions", body: "Owner leads are infrequent but high-value, meaning content depth and trust signals matter more than volume." },
      { title: "Regional market specificity", body: "Owners want to know a company genuinely understands their specific local rental market." },
    ],
    howCustomersSearch: "Owner-facing searches (\"property management company [city]\", \"how much do property managers charge\") are distinct from tenant-facing rental searches, and treating them as one audience typically underperforms for both.",
    seoOpportunities: ["Dedicated owner-facing lead generation pages, separate from rental listings", "Local SEO and market-specific content demonstrating regional expertise", "Pricing and fee-structure transparency content addressing a top search driver", "Technical SEO for listing-heavy sites prone to duplicate content"],
    gbpOpportunities: ["Accurate service area and property-type specialization", "Owner-focused review generation and testimonials", "Regular market update posts"],
    conversionOpportunities: ["Clear owner consultation request separate from tenant inquiries", "Transparent fee and service information", "Fast-loading, professional site design"],
    contentStrategy: ["Fee structure and service transparency content", "Local rental market update content", "Owner-focused guides (tax, maintenance, tenant screening)"],
    states: ["Florida", "Texas", "California", "Arizona", "Georgia", "North Carolina", "Nevada", "Tennessee"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Real Estate & Property", href: "/industries/real-estate/" },
    ],
    faqs: [
      { question: "How do you separate owner and tenant content?", answer: "We build dedicated owner-facing lead generation pages and content distinct from tenant-facing rental listings, since these are different audiences with different needs." },
      { question: "Can you help with fee transparency content?", answer: "Yes — pricing and fee-structure questions are a major search driver in this category, and clear, honest content here builds trust before the first call." },
      { question: "Do you cover multiple markets for regional property managers?", answer: "Yes, using genuinely distinct, locally-researched content per market rather than a templated multi-location rollout." },
    ],
  },
  "moving-company-seo": {
    slug: "moving-company-seo",
    icon: "layers",
    name: "Moving Companies",
    metaTitle: "SEO for Moving Companies | Mover SEO Services",
    metaDescription: "SEO services specifically for local and long-distance moving companies competing for direct, non-marketplace bookings.",
    heroDescription: "Moving companies that build genuine local and route-specific visibility reduce their dependence on paid lead marketplaces over time.",
    challenges: [
      { title: "Lead marketplace margin pressure", body: "Third-party lead platforms take a cut of every job while controlling much of the customer relationship." },
      { title: "Route and service-type breadth", body: "Local moves, long-distance moves, and commercial moves are distinct services that deserve distinct pages." },
      { title: "Trust deficit specific to the industry", body: "The moving industry faces above-average consumer skepticism that consistent reviews help overcome." },
    ],
    howCustomersSearch: "Local move searches (\"movers near me\") differ from long-distance route searches (\"movers from [city] to [city]\"), with the latter often reflecting higher-value, more research-heavy bookings.",
    seoOpportunities: ["Dedicated local, long-distance, and commercial move pages", "Route-specific content for common long-distance corridors", "Local SEO to reduce marketplace lead dependence", "Trust-building content directly addressing industry skepticism"],
    gbpOpportunities: ["Complete licensing and insurance display", "Review generation immediately after job completion", "Photo documentation of crews and equipment"],
    conversionOpportunities: ["Fast, simple quote request forms", "Transparent estimate and pricing information", "Prominent licensing and insurance trust signals"],
    contentStrategy: ["Route-specific moving guides", "Pricing transparency and estimate-process content", "Moving checklists and preparation guides"],
    states: ["Texas", "Florida", "California", "New York", "Illinois", "Georgia", "North Carolina", "Arizona"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Lead Generation", href: "/services/lead-generation/" },
      { label: "Moving & Logistics", href: "/industries/moving-and-logistics/" },
    ],
    faqs: [
      { question: "Do you build route-specific pages for long-distance moves?", answer: "Yes — common corridors (e.g. a city-to-city route you handle frequently) often justify their own dedicated, genuinely useful page." },
      { question: "How do you address the industry's trust deficit?", answer: "Through consistent, recent reviews, transparent pricing, and visible licensing and insurance information, which are the trust signals customers weigh most heavily." },
      { question: "Can this reduce our spend on lead marketplaces?", answer: "Building organic and local visibility is the main path to that outcome, though it takes sustained investment rather than a quick switch." },
    ],
  },
  "auto-repair-seo": {
    slug: "auto-repair-seo",
    icon: "cpu",
    name: "Auto Repair Shops",
    metaTitle: "SEO for Auto Repair Shops | Auto Shop SEO",
    metaDescription: "SEO services for independent auto repair shops competing against franchise chains and price-comparison search behavior.",
    heroDescription: "Independent auto repair shops win on trust and reviews where franchise chains win on paid spend — organic and local SEO is where that advantage compounds.",
    challenges: [
      { title: "Franchise chain competition", body: "National chains often outspend independents on paid ads, making organic visibility a proportionally larger opportunity." },
      { title: "Price-comparison search behavior", body: "Routine service searches are heavily price- and review-driven with thin differentiation." },
      { title: "Service-type breadth", body: "Brakes, transmission, and general repair each represent distinct search intents worth their own pages." },
    ],
    howCustomersSearch: "A mix of routine (\"oil change near me\") and specific repair searches (\"transmission repair [city]\"), with reviews and price transparency weighing heavily in the decision between similarly-positioned shops.",
    seoOpportunities: ["Service-specific pages (brakes, transmission, general repair, diagnostics)", "Local SEO and Google Business Profile optimization", "Pricing transparency content addressing a top search driver", "Technical SEO for fast mobile experience"],
    gbpOpportunities: ["Accurate service categories and hours", "Consistent review generation tied to service completion", "Photo documentation building trust"],
    conversionOpportunities: ["Simple appointment or estimate request", "Transparent, easy-to-find pricing where competitive", "Clear certifications and warranty information"],
    contentStrategy: ["Maintenance guides by vehicle type and season", "Pricing transparency content", "Trust-building content (certifications, technician expertise, warranty)"],
    states: ["Texas", "Florida", "California", "Arizona", "Georgia", "North Carolina", "Illinois", "New York"],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Automotive Services", href: "/industries/automotive/" },
    ],
    faqs: [
      { question: "Can independent shops really compete with chains here?", answer: "Yes — organic and local SEO is proportionally more valuable for independents, since chains often win on paid spend but not necessarily on genuine local relevance and reviews." },
      { question: "Do you recommend posting prices online?", answer: "Where you're price-competitive, transparent pricing content tends to perform well since it directly addresses a top search driver in this category." },
      { question: "How many service pages should we build?", answer: "We typically recommend dedicated pages for your highest-volume services (brakes, oil changes, diagnostics) rather than one generic services page." },
    ],
  },
  "accounting-firm-seo": {
    slug: "accounting-firm-seo",
    icon: "file-text",
    name: "Accounting & Bookkeeping Firms",
    metaTitle: "SEO for Accounting Firms | Accounting SEO Services",
    metaDescription: "SEO and content strategy for accounting, bookkeeping, and tax firms targeting small-business and individual clients.",
    heroDescription: "Accounting clients research extensively before choosing a firm — clear, specific content on services and specialties builds the trust a referral used to provide.",
    challenges: [
      { title: "Seasonal search spikes", body: "Tax season drives outsized search volume, rewarding firms with existing visibility well before the rush." },
      { title: "Small business vs. individual client split", body: "Small-business accounting and individual tax prep are different searches that deserve different pages." },
      { title: "Generic \"accountant near me\" competition", body: "Broad terms are crowded; specific-service pages (e.g. \"outsourced bookkeeping for small business\") are often a better opportunity." },
    ],
    howCustomersSearch: "Ranges from seasonal (\"tax preparation near me\") to ongoing-service searches (\"outsourced bookkeeping for small business\"), with small-business owners often researching more deeply before choosing a firm.",
    seoOpportunities: ["Dedicated pages per service (bookkeeping, tax prep, CFO advisory, payroll)", "Content published ahead of tax season for the seasonal spike", "Local SEO for firms serving a specific regional market", "Niche-industry content if the firm specializes in a vertical"],
    gbpOpportunities: ["Accurate service and specialty categories", "Client testimonials where approved for sharing", "Consistent activity signals through seasonal posts"],
    conversionOpportunities: ["Clear, low-commitment consultation request CTA", "Transparent service and pricing information where possible", "Fast-loading, professional site design"],
    contentStrategy: ["Tax-season preparation guides published ahead of the rush", "Small-business financial guidance content", "Service-specific explainer content (bookkeeping vs. CFO advisory, etc.)"],
    states: ["Texas", "Florida", "California", "New York", "Illinois", "Georgia", "North Carolina", "Arizona"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Professional & B2B Services", href: "/industries/professional-services/" },
    ],
    faqs: [
      { question: "How do you handle tax-season seasonality?", answer: "We publish and optimize seasonal content well ahead of the rush so your visibility is already established when search volume spikes." },
      { question: "Do you separate small-business and individual client content?", answer: "Yes — these represent different search intents and typically convert better with dedicated pages rather than one blended services page." },
      { question: "Can this help with a specific industry specialty?", answer: "Yes — if your firm specializes in a vertical (e.g. restaurants, medical practices), we build content that reflects and targets that specialty directly." },
    ],
  },
  "managed-it-seo": {
    slug: "managed-it-seo",
    icon: "code",
    name: "Managed IT & Cybersecurity Providers",
    metaTitle: "SEO for Managed IT Providers | MSP SEO Services",
    metaDescription: "SEO and content strategy for managed IT service providers and cybersecurity firms selling trust and expertise to business buyers.",
    heroDescription: "MSP buyers research extensively and compare technical depth carefully — generic \"IT services\" pages rarely convert as well as specific, expertise-driven content.",
    challenges: [
      { title: "Long, trust-heavy sales cycles", body: "IT and cybersecurity decisions involve real risk, so buyers research thoroughly before ever reaching out." },
      { title: "Broad service scope", body: "Managed IT, cybersecurity, cloud services, and compliance support are distinct enough to need separate pages." },
      { title: "Compliance and industry-specific buyers", body: "Healthcare, legal, and financial clients often search with compliance-specific language (HIPAA, SOC 2) that generic content misses." },
    ],
    howCustomersSearch: "Ranges from broad (\"managed IT services near me\") to compliance-specific (\"HIPAA compliant IT support\") and incident-driven (\"cybersecurity incident response\"), with the compliance segment often underserved by competitors.",
    seoOpportunities: ["Dedicated pages per service line (managed IT, cybersecurity, cloud, compliance)", "Compliance-specific content targeting underserved, high-intent search terms", "Local SEO for firms serving a defined regional market", "Case studies demonstrating specific technical expertise"],
    gbpOpportunities: ["Accurate service and specialty categories", "Client testimonials and case studies where approved", "Consistent activity signals through regular posts"],
    conversionOpportunities: ["Clear, low-commitment security assessment or consultation CTA", "Case studies and certifications placed prominently", "Fast-loading, professional, security-conscious site design"],
    contentStrategy: ["Compliance-specific guides (HIPAA, SOC 2, PCI-DSS)", "Incident-response and cybersecurity risk content", "Case studies demonstrating specific technical outcomes"],
    states: ["Texas", "Florida", "California", "New York", "Illinois", "Georgia", "North Carolina", "Arizona"],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Professional & B2B Services", href: "/industries/professional-services/" },
    ],
    faqs: [
      { question: "Do you target compliance-specific search terms?", answer: "Yes — compliance-driven searches (HIPAA, SOC 2, etc.) are often underserved and high-intent, making them a strong content opportunity for MSPs serving regulated industries." },
      { question: "How do you handle the technical depth buyers expect?", answer: "We work with your team to make sure content reflects genuine technical accuracy and depth, not generic marketing language that experienced buyers will see through." },
      { question: "Can you write case studies for us?", answer: "Yes, based on results and details your firm provides and approves for publication." },
    ],
  },
};
