import { SERVICES } from "./site";

export type ServiceContent = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  problem: { title: string; body: string };
  solution: { title: string; body: string };
  includes: string[];
  howItWorks: { step: string; title: string; body: string }[];
  outcomes: string[];
  suitableFor: string[];
  examples: string[];
  internalLinks: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  seo: {
    slug: "seo",
    name: "SEO",
    metaTitle: "SEO Services for US Businesses",
    metaDescription:
      "Full-funnel SEO services for US businesses — technical fixes, content strategy, and authority building designed to earn durable organic rankings.",
    heroDescription:
      "Search engine optimization built around how your specific market actually searches — not a generic national playbook applied to every client the same way.",
    problem: {
      title: "Rankings that don't move, or move and don't matter",
      body: "Many businesses have tried SEO before — a few blog posts, some backlinks, maybe a technical fix or two — without a documented strategy tying any of it to revenue. The result is often flat rankings for terms that don't drive calls, forms, or bookings.",
    },
    solution: {
      title: "A strategy built around commercial intent, not vanity keywords",
      body: "We start by mapping the searches your actual buyers use at each stage of their decision, then build a technical, content, and authority roadmap around the terms with real business value — prioritized by effort versus payoff.",
    },
    includes: [
      "Full technical SEO audit and fix roadmap",
      "Keyword research mapped to commercial intent, not just search volume",
      "On-page optimization across priority pages",
      "Content strategy tied to funnel stage",
      "Competitor gap analysis",
      "Monthly reporting tied to rankings, traffic, and leads",
    ],
    howItWorks: [
      { step: "01", title: "Audit", body: "We assess your current technical health, content, and competitive position." },
      { step: "02", title: "Strategy", body: "You get a prioritized roadmap built around your market and goals." },
      { step: "03", title: "Execution", body: "Technical fixes, content, and on-page work ship on a set cadence." },
      { step: "04", title: "Reporting", body: "Monthly reporting shows what moved and what's next." },
    ],
    outcomes: [
      "Improved visibility for commercially valuable search terms",
      "A technically healthy site that search engines can fully crawl and index",
      "Content that supports every stage of the buyer journey",
      "Clearer reporting tying SEO work to leads",
    ],
    suitableFor: ["Established local businesses", "Multi-location companies", "Professional service firms", "E-commerce and lead-gen businesses with an existing customer base"],
    examples: [
      "A Texas HVAC company competing for \"AC repair\" terms across five service areas",
      "A California law firm rebuilding topical authority after a site migration",
      "A Florida med spa consolidating overlapping service pages that were cannibalizing each other",
    ],
    internalLinks: [
      { label: "Technical SEO", href: "/services/technical-seo/" },
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Content Marketing", href: "/services/content-marketing/" },
    ],
    faqs: [
      { question: "How is this different from local SEO?", answer: "SEO covers your full organic footprint — national and category terms included. Local SEO is a more focused subset for businesses ranking primarily in map-based, city-specific results." },
      { question: "Do you handle both technical fixes and content?", answer: "Yes — SEO engagements include technical audits, on-page optimization, and a content roadmap so nothing gets siloed." },
      { question: "What's a realistic timeline?", answer: "Most clients see measurable movement in 90 to 180 days, with results compounding as technical fixes and content accumulate." },
    ],
  },
  "local-seo": {
    slug: "local-seo",
    name: "Local SEO",
    metaTitle: "Local SEO Services for US Businesses",
    metaDescription:
      "Local SEO services that improve Map Pack visibility, citation consistency, and review growth for businesses serving specific US cities and neighborhoods.",
    heroDescription:
      "Local SEO focused on the three-pack and neighborhood-level visibility that drives calls, directions, and bookings from nearby customers.",
    problem: {
      title: "Invisible in the map pack, even with a decent website",
      body: "A strong website doesn't guarantee Map Pack visibility. Local rankings depend on a different mix of signals — profile completeness, citation consistency, review velocity, and proximity — that general SEO work often overlooks entirely.",
    },
    solution: {
      title: "A local-signal system, not a one-time profile cleanup",
      body: "We build and maintain the specific signals that drive local rankings: an optimized Google Business Profile, consistent citations across directories, a sustainable review-generation process, and location pages with genuine local substance.",
    },
    includes: [
      "Google Business Profile optimization and ongoing management",
      "Citation audit and consistency cleanup",
      "Review-generation workflow design",
      "Local landing page strategy for each service area",
      "Local competitor and Map Pack analysis",
      "Conversion tracking for calls, directions, and form fills",
    ],
    howItWorks: [
      { step: "01", title: "Local audit", body: "We check your current Map Pack position, citations, and profile health." },
      { step: "02", title: "Foundation", body: "We fix profile gaps and citation inconsistencies first." },
      { step: "03", title: "Growth", body: "Review generation, local content, and link building build momentum." },
      { step: "04", title: "Monitoring", body: "We track rank changes by location and adjust the plan monthly." },
    ],
    outcomes: [
      "Stronger Map Pack visibility for your priority service areas",
      "A Google Business Profile that actively generates calls and direction requests",
      "Consistent business information across the directories that matter",
      "A repeatable process for earning new reviews",
    ],
    suitableFor: ["Home services companies", "Healthcare and dental practices", "Legal practices with a defined service area", "Any business competing primarily on local, in-person visits"],
    examples: [
      "A plumbing company in Houston losing Map Pack position to a competitor with more recent reviews",
      "A multi-location dental group with inconsistent NAP data across ten directories",
      "A landscaping company in Phoenix expanding into two new suburbs",
    ],
    internalLinks: [
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
      { label: "Home Services Industry", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Do I need a physical office for local SEO to work?", answer: "No. Service-area businesses without a public office can still rank well using service-area settings and consistent local signals — we just avoid claiming a storefront that doesn't exist." },
      { question: "How many locations can this cover?", answer: "This works for a single location or dozens — for larger multi-location footprints, see our Multi-Location SEO service for the scaled version of this process." },
      { question: "Can you generate reviews for us?", answer: "We design and implement the workflow that makes it easy for happy customers to leave a review — we don't buy, fake, or incentivize reviews, which violates platform policy and damages trust." },
    ],
  },
  "technical-seo": {
    slug: "technical-seo",
    name: "Technical SEO",
    metaTitle: "Technical SEO Services for US Businesses",
    metaDescription:
      "Technical SEO audits and fixes covering crawlability, indexation, Core Web Vitals, and schema markup for US business websites.",
    heroDescription:
      "The unglamorous, high-leverage SEO work — fixing the crawl, speed, and indexation issues that quietly cap every other marketing effort.",
    problem: {
      title: "Content and links can't fix a site search engines can't crawl",
      body: "Slow load times, broken redirect chains, orphaned pages, and inconsistent canonicals silently suppress rankings no matter how good your content is. Most businesses don't know these issues exist until they're pointed out.",
    },
    solution: {
      title: "A prioritized technical roadmap, not a 200-item spreadsheet",
      body: "We run a full technical crawl, then rank issues by actual ranking impact — so you fix the handful of things that matter first instead of drowning in a generic audit checklist.",
    },
    includes: [
      "Full-site crawl and indexation audit",
      "Core Web Vitals and page speed diagnostics",
      "Redirect chain and broken link cleanup",
      "Canonical and duplicate content review",
      "Structured data (schema) implementation",
      "Site architecture and internal linking review",
    ],
    howItWorks: [
      { step: "01", title: "Crawl", body: "We run a comprehensive technical crawl of your entire indexable site." },
      { step: "02", title: "Prioritize", body: "Issues are ranked by estimated ranking and crawl-budget impact." },
      { step: "03", title: "Fix", body: "We implement fixes directly or hand off clear, developer-ready tickets." },
      { step: "04", title: "Validate", body: "We confirm fixes resolved in Search Console and re-crawl to verify." },
    ],
    outcomes: [
      "A site search engines can fully crawl and index",
      "Faster load times and improved Core Web Vitals",
      "Clean, valid structured data supporting rich results",
      "Elimination of redirect chains and duplicate content issues",
    ],
    suitableFor: ["Sites that have undergone a redesign or platform migration", "Businesses with flat or declining organic traffic despite content investment", "Multi-location or large-catalog sites", "Any site with known speed or mobile usability complaints"],
    examples: [
      "A New York law firm site losing indexation after a CMS migration introduced broken canonicals",
      "A North Carolina retailer with a 4-second mobile load time capping conversions",
      "A property management company with thousands of orphaned old listing pages",
    ],
    internalLinks: [
      { label: "Website Development", href: "/services/website-development/" },
      { label: "SEO", href: "/services/seo/" },
      { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization/" },
    ],
    faqs: [
      { question: "How long does a technical audit take?", answer: "Initial findings are typically ready within one to two weeks, depending on site size, with implementation timelines varying by how many fixes require developer involvement." },
      { question: "Will you implement fixes or just report them?", answer: "Both are available — we can implement directly on supported platforms or hand off clear, prioritized tickets to your existing development team." },
      { question: "Do you guarantee a specific Core Web Vitals score?", answer: "We target strong, industry-competitive scores but can't guarantee an exact number, since third-party scripts and hosting outside our control also affect performance." },
    ],
  },
  "google-business-profile-optimization": {
    slug: "google-business-profile-optimization",
    name: "Google Business Profile Optimization",
    metaTitle: "Google Business Profile Optimization for US Businesses",
    metaDescription:
      "Google Business Profile optimization services to improve Map Pack rankings, profile completeness, and lead generation for US businesses.",
    heroDescription:
      "Turn your Google Business Profile from a static listing into an active lead source with regular optimization, posts, and monitoring.",
    problem: {
      title: "A claimed profile is not an optimized profile",
      body: "Most businesses claim their Google Business Profile once and never touch it again. Meanwhile, competitors are posting updates, responding to every review, and keeping categories and services current — all signals that affect ranking.",
    },
    solution: {
      title: "Ongoing profile management, not a one-time setup",
      body: "We optimize every field that affects ranking and conversion — categories, services, attributes, Q&A, and photos — then keep the profile active with regular posts and prompt review responses.",
    },
    includes: [
      "Full profile audit and optimization across all fields",
      "Category and service structure review",
      "Photo and media strategy",
      "Review response management",
      "Regular Google Posts to keep the profile active",
      "Performance tracking (calls, direction requests, website clicks)",
    ],
    howItWorks: [
      { step: "01", title: "Audit", body: "We review your current profile against ranking best practices and competitor profiles." },
      { step: "02", title: "Optimize", body: "We fix categories, services, attributes, and media." },
      { step: "03", title: "Activate", body: "Regular posts and prompt review responses keep the profile signaling activity." },
      { step: "04", title: "Report", body: "You see monthly performance across calls, clicks, and direction requests." },
    ],
    outcomes: [
      "A fully optimized profile aligned with your actual services",
      "Improved Map Pack visibility for your priority categories",
      "Faster, more consistent review responses",
      "Clear visibility into profile-driven leads",
    ],
    suitableFor: ["Any business with a physical location or defined service area", "Home services and contractors", "Healthcare and dental practices", "Restaurants and retail with a local footprint"],
    examples: [
      "An Atlanta electrician with an incomplete profile missing half its actual services",
      "A Chicago dental practice with 40 unanswered reviews",
      "A Miami HVAC company that hadn't posted an update in over a year",
    ],
    internalLinks: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
      { label: "Home Services Industry", href: "/industries/home-services/" },
    ],
    faqs: [
      { question: "Can you help if our profile was suspended?", answer: "We can review the likely cause and guide reinstatement steps, though Google makes the final reinstatement decision, not us." },
      { question: "Do you respond to reviews on our behalf?", answer: "Yes, using a tone and voice guide you approve, with escalation to your team for sensitive or complex situations." },
      { question: "How often will the profile be updated?", answer: "We recommend at minimum weekly posting activity, with real-time review responses and monthly full-profile reviews." },
    ],
  },
  "website-design": {
    slug: "website-design",
    name: "Website Design",
    metaTitle: "Website Design Services for US Businesses",
    metaDescription:
      "Premium, conversion-focused website design for US businesses — built to establish trust in seconds and guide visitors toward a clear next action.",
    heroDescription:
      "Design that builds credibility in the first three seconds and makes the next step — call, form, or booking — obvious.",
    problem: {
      title: "A dated design quietly costs you every visitor's trust",
      body: "Visitors form a credibility judgment almost instantly. A cluttered, outdated, or generic-looking site — even with great content underneath — loses trust before anyone reads a word.",
    },
    solution: {
      title: "Premium, on-brand design built around your conversion goal",
      body: "We design every page around a clear objective — a call, a form, a booking — using clean typography, strong visual hierarchy, and a layout system that scales across your full site, not just the homepage.",
    },
    includes: [
      "Custom homepage and inner-page design system",
      "Mobile-first responsive layouts",
      "Conversion-focused page structure",
      "Brand-consistent visual system (typography, color, components)",
      "Accessibility-conscious design (WCAG 2.2 AA target)",
      "Design handoff ready for development",
    ],
    howItWorks: [
      { step: "01", title: "Discovery", body: "We review your brand, competitors, and conversion goals." },
      { step: "02", title: "Wireframe", body: "Page structure is mapped around your priority actions before visual design starts." },
      { step: "03", title: "Design", body: "We design a full visual system, not just isolated pages." },
      { step: "04", title: "Handoff", body: "Designs are delivered dev-ready, or move directly into our development process." },
    ],
    outcomes: [
      "A site that establishes credibility immediately",
      "Consistent, on-brand design across every page",
      "Clear visual hierarchy guiding visitors to your CTA",
      "A scalable design system for future pages",
    ],
    suitableFor: ["Businesses with an outdated or template-heavy website", "Companies rebranding or repositioning", "Multi-location businesses needing a consistent page system", "Any business where the current site undersells the business itself"],
    examples: [
      "A North Carolina contractor whose site looked over a decade old next to newer competitors",
      "A California med spa needing a premium visual identity to match its pricing",
      "A property management company consolidating five inconsistent location page designs",
    ],
    internalLinks: [
      { label: "Website Development", href: "/services/website-development/" },
      { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization/" },
      { label: "AI Digital Marketing", href: "/services/ai-digital-marketing/" },
    ],
    faqs: [
      { question: "Do you redesign existing sites or only build new ones?", answer: "Both — many engagements start as a redesign of an existing site rather than a full rebuild." },
      { question: "Will the design be mobile-friendly?", answer: "Yes, every design is built mobile-first and tested across standard breakpoints before development begins." },
      { question: "Can you match our existing brand guidelines?", answer: "Yes — if you have brand guidelines, we design within them; if not, we can help establish a lightweight visual system as part of the engagement." },
    ],
  },
  "website-development": {
    slug: "website-development",
    name: "Website Development",
    metaTitle: "Website Development Services for US Businesses",
    metaDescription:
      "Fast, technically sound website development for US businesses — built for Core Web Vitals, SEO, and conversion from the first line of code.",
    heroDescription:
      "Modern, fast website builds engineered for Core Web Vitals, clean SEO fundamentals, and conversion — not just a pretty template.",
    problem: {
      title: "A beautiful design that loads slowly is a beautiful loss",
      body: "Heavy page builders, unoptimized images, and bloated third-party scripts routinely undo good design work, pushing load times past the point where visitors simply leave.",
    },
    solution: {
      title: "Performance-first development, SEO-aware from the ground up",
      body: "We build with modern, efficient frameworks, optimize every asset, and structure the codebase so SEO fundamentals — clean URLs, semantic HTML, proper heading hierarchy — are correct by default, not bolted on after launch.",
    },
    includes: [
      "Modern, framework-based development (fast, maintainable, scalable)",
      "Core Web Vitals optimization",
      "Clean semantic HTML and heading structure",
      "Mobile responsiveness across standard breakpoints",
      "Analytics and conversion tracking setup",
      "Launch QA (broken links, forms, cross-browser checks)",
    ],
    howItWorks: [
      { step: "01", title: "Architecture", body: "We plan the technical structure — routing, content model, and performance budget." },
      { step: "02", title: "Build", body: "Development proceeds in staged milestones you can review as they land." },
      { step: "03", title: "Optimize", body: "We tune performance, accessibility, and SEO fundamentals before launch." },
      { step: "04", title: "Launch & QA", body: "Full QA pass across devices, browsers, and forms before going live." },
    ],
    outcomes: [
      "Fast load times that support both SEO and conversion",
      "A technically clean foundation for ongoing SEO work",
      "A maintainable codebase that scales with your business",
      "Working analytics and conversion tracking from day one",
    ],
    suitableFor: ["Businesses outgrowing a page-builder or template site", "Companies needing a scalable multi-location page structure", "Sites with known performance or Core Web Vitals problems", "Any business investing seriously in SEO that needs a technically sound foundation"],
    examples: [
      "A Georgia HVAC company migrating off a slow, plugin-heavy WordPress build",
      "A Texas moving company needing a scalable page structure for dozens of service areas",
      "A financial services firm requiring a fast, accessible, compliant site structure",
    ],
    internalLinks: [
      { label: "Website Design", href: "/services/website-design/" },
      { label: "Technical SEO", href: "/services/technical-seo/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
    ],
    faqs: [
      { question: "What platform do you build on?", answer: "We select the platform based on your needs — often a modern framework like Next.js for performance and SEO control, though WordPress or other CMS platforms remain a fit for some businesses." },
      { question: "Do you handle ongoing maintenance after launch?", answer: "Yes, ongoing maintenance and iteration can be scoped as part of a retainer once the initial build launches." },
      { question: "Will the new site keep our current SEO rankings?", answer: "We plan migrations carefully — redirects, canonical mapping, and pre/post-launch monitoring — specifically to protect existing rankings through the transition." },
    ],
  },
  "content-marketing": {
    slug: "content-marketing",
    name: "Content Marketing",
    metaTitle: "Content Marketing Services for US Businesses",
    metaDescription:
      "Content marketing built to rank, answer real search intent, and move US buyers toward a decision — not generic blog posts for the sake of volume.",
    heroDescription:
      "Content built to rank, answer the actual question being asked, and move a buyer one step closer to contacting you.",
    problem: {
      title: "Content for content's sake doesn't move revenue",
      body: "Many businesses publish blog posts on a schedule without a clear tie to search intent, funnel stage, or commercial value — resulting in traffic, if any, that never converts.",
    },
    solution: {
      title: "Content mapped to funnel stage and internal linking, not just topics",
      body: "Every piece is planned against a specific search intent and connected back to the commercial pages it should support — so content builds topical authority and drives qualified traffic toward a conversion point.",
    },
    includes: [
      "Content strategy and editorial roadmap",
      "Keyword and search-intent research",
      "SEO-optimized article writing",
      "Internal linking strategy connecting content to commercial pages",
      "On-page optimization (titles, headers, schema)",
      "Performance tracking by article",
    ],
    howItWorks: [
      { step: "01", title: "Research", body: "We map search intent and content gaps against your commercial pages." },
      { step: "02", title: "Plan", body: "You get a prioritized editorial roadmap tied to funnel stage." },
      { step: "03", title: "Produce", body: "Content is written, reviewed, and optimized before publishing." },
      { step: "04", title: "Measure", body: "We track rankings, traffic, and downstream conversions by article." },
    ],
    outcomes: [
      "Content that supports specific commercial pages, not just traffic totals",
      "Growing topical authority in your core service areas",
      "A documented, prioritized editorial roadmap",
      "Clear reporting on which content drives qualified traffic",
    ],
    suitableFor: ["Businesses with commercial pages but no supporting content", "Companies wanting to build topical authority in a competitive niche", "Multi-service businesses needing content across several silos", "Any business investing in SEO where content is currently the weak link"],
    examples: [
      "An Arizona solar installer needing content to support financing and rebate-related searches",
      "An Illinois accounting firm building authority around small-business tax topics",
      "A Florida real estate team creating neighborhood-specific buyer guides",
    ],
    internalLinks: [
      { label: "SEO", href: "/services/seo/" },
      { label: "AI Digital Marketing", href: "/services/ai-digital-marketing/" },
      { label: "Insights", href: "/insights/" },
    ],
    faqs: [
      { question: "How much content do we need to publish?", answer: "It depends on your competitive landscape — we recommend a specific cadence after the initial content gap analysis rather than a one-size-fits-all number." },
      { question: "Who writes the content?", answer: "Our team writes and edits every piece, using AI-assisted research to speed up the process while keeping quality control and final judgment human." },
      { question: "Will content alone improve our rankings?", answer: "Content works best paired with sound technical SEO and internal linking — publishing in isolation rarely produces the same results." },
    ],
  },
  "lead-generation": {
    slug: "lead-generation",
    name: "Lead Generation",
    metaTitle: "Lead Generation Services for US Businesses",
    metaDescription:
      "Lead generation services that turn organic and paid traffic into booked calls and signed contracts for US businesses.",
    heroDescription:
      "Turning visibility into booked calls, submitted forms, and signed contracts — not just traffic for its own sake.",
    problem: {
      title: "Traffic without a system doesn't become revenue",
      body: "Many businesses invest in SEO or ads and see traffic increase, but leads stay flat because there's no clear conversion path, follow-up system, or tracking connecting clicks to closed business.",
    },
    solution: {
      title: "A full-funnel lead system, not just a landing page",
      body: "We connect the traffic-generating work (SEO, content, ads) to a conversion path built specifically to capture and qualify leads, with tracking that shows exactly where leads come from.",
    },
    includes: [
      "Lead capture strategy across your site (forms, calls, chat)",
      "Landing page design for specific offers or campaigns",
      "Lead qualification and tracking setup",
      "CRM-ready form structure",
      "Call and form conversion tracking",
      "Monthly lead volume and source reporting",
    ],
    howItWorks: [
      { step: "01", title: "Map the funnel", body: "We identify where leads currently drop off between visit and conversion." },
      { step: "02", title: "Build capture points", body: "Forms, calls, and offers are optimized or built where they're missing." },
      { step: "03", title: "Connect tracking", body: "Every lead source is tracked back to the channel that produced it." },
      { step: "04", title: "Report and refine", body: "Monthly reporting shows lead volume, source, and quality trends." },
    ],
    outcomes: [
      "A clearer, trackable path from traffic to lead",
      "Reduced dependence on paid lead-generation platforms over time",
      "Better visibility into which channels actually produce leads",
      "A conversion path built specifically around your offer",
    ],
    suitableFor: ["Businesses buying leads from third-party platforms and wanting more control", "Companies with traffic but unclear conversion tracking", "Multi-location businesses needing centralized lead attribution", "Service businesses selling high-value jobs or contracts"],
    examples: [
      "A Nevada moving company reducing reliance on paid lead marketplaces",
      "A Tennessee roofing company needing clearer attribution across five ad and organic channels",
      "A New Jersey staffing agency building a qualification step before leads reach sales",
    ],
    internalLinks: [
      { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization/" },
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Free SEO Audit", href: "/free-seo-audit/" },
    ],
    faqs: [
      { question: "Do you run paid ads as part of this?", answer: "Our core focus is organic and conversion infrastructure; paid campaign management can be scoped separately if it's part of your broader strategy." },
      { question: "Can this integrate with our CRM?", answer: "Yes — forms are built CRM-ready and can be connected to common CRM and workflow platforms once credentials are provided." },
      { question: "How do you track phone call leads?", answer: "We implement call tracking so calls generated by your site or campaigns are attributed back to their source channel." },
    ],
  },
  "conversion-rate-optimization": {
    slug: "conversion-rate-optimization",
    name: "Conversion Rate Optimization",
    metaTitle: "Conversion Rate Optimization Services for US Businesses",
    metaDescription:
      "Conversion rate optimization services that get more calls, forms, and bookings out of the traffic your US business already earns.",
    heroDescription:
      "Getting more calls, forms, and bookings out of the traffic you're already earning — before you spend more to get new visitors.",
    problem: {
      title: "More traffic doesn't fix a leaky conversion path",
      body: "It's common for businesses to pour budget into driving more visitors while the underlying site quietly loses a large share of them to confusing layouts, slow forms, or unclear calls to action.",
    },
    solution: {
      title: "Structured testing and UX fixes, not guesswork",
      body: "We review your analytics and user behavior to identify specific friction points, then prioritize fixes by expected impact — from clearer CTAs to shorter forms to faster load times.",
    },
    includes: [
      "Conversion funnel audit using existing analytics data",
      "Heuristic UX review of key pages",
      "CTA placement and messaging optimization",
      "Form length and friction reduction",
      "Mobile conversion path review",
      "Before/after performance reporting",
    ],
    howItWorks: [
      { step: "01", title: "Audit", body: "We review analytics and page behavior to find where visitors drop off." },
      { step: "02", title: "Prioritize", body: "Fixes are ranked by estimated conversion impact and effort." },
      { step: "03", title: "Implement", body: "Changes are made directly or handed to your development team." },
      { step: "04", title: "Measure", body: "We track conversion rate changes before and after each round of fixes." },
    ],
    outcomes: [
      "A measurably higher conversion rate from existing traffic",
      "Clearer, more direct paths to your key CTAs",
      "Reduced form abandonment",
      "Better mobile conversion performance",
    ],
    suitableFor: ["Businesses with steady traffic but flat lead volume", "Sites with long or complex forms", "Companies about to increase ad spend and wanting a stronger landing experience first", "Any business unsure why visitors aren't converting"],
    examples: [
      "A Colorado law firm whose 12-field intake form was quietly killing submissions",
      "A Washington contractor whose primary CTA was buried below three scrolls",
      "A Massachusetts dental practice with a booking flow that broke on mobile Safari",
    ],
    internalLinks: [
      { label: "Website Design", href: "/services/website-design/" },
      { label: "Lead Generation", href: "/services/lead-generation/" },
      { label: "Technical SEO", href: "/services/technical-seo/" },
    ],
    faqs: [
      { question: "Do we need a lot of traffic for this to work?", answer: "Some minimum traffic volume helps validate results statistically, but many fixes — clearer CTAs, shorter forms — are worth making even at moderate traffic levels." },
      { question: "How long until we see results?", answer: "Straightforward fixes can show impact within weeks; more complex structural changes may take a full reporting cycle to evaluate." },
      { question: "Will you run formal A/B tests?", answer: "Where traffic supports statistically meaningful testing, yes — otherwise we rely on heuristic review and sequential before/after comparison." },
    ],
  },
  "multi-location-seo": {
    slug: "multi-location-seo",
    name: "Multi-Location SEO",
    metaTitle: "Multi-Location SEO Services for US Businesses",
    metaDescription:
      "Multi-location SEO services that scale visibility across every market a US business serves without duplicate content or cannibalization risk.",
    heroDescription:
      "Scaling local visibility across every market you serve without duplicating your way into a Google penalty.",
    problem: {
      title: "Location pages built by find-and-replace hurt more than they help",
      body: "The fastest way to build ten location pages is to copy one and swap the city name. It's also one of the fastest ways to trigger duplicate-content issues and waste crawl budget without earning any of the rankings you wanted.",
    },
    solution: {
      title: "A scalable architecture with genuinely unique location content",
      body: "We build a reusable page framework, then populate it with real local specifics — market context, local competition, and location-relevant service detail — so every page earns its own ranking instead of competing with your others.",
    },
    includes: [
      "Multi-location site architecture and URL structure",
      "Location-specific content for every market",
      "Centralized Google Business Profile management across locations",
      "Citation consistency across all locations",
      "Cross-location internal linking strategy",
      "Centralized reporting by location",
    ],
    howItWorks: [
      { step: "01", title: "Architecture", body: "We design a scalable state/city URL structure that avoids cannibalization." },
      { step: "02", title: "Content", body: "Each location page is built with genuine local specificity." },
      { step: "03", title: "Profiles", body: "We manage Business Profiles consistently across every location." },
      { step: "04", title: "Reporting", body: "Centralized reporting shows performance by market." },
    ],
    outcomes: [
      "Location pages that rank independently instead of competing with each other",
      "Consistent brand and NAP data across every market",
      "A scalable framework for adding new locations over time",
      "Clear, location-level performance visibility",
    ],
    suitableFor: ["Franchises and multi-location brands", "Companies expanding into new service areas", "Businesses with existing thin or duplicated location pages", "Regional or national service companies"],
    examples: [
      "A restoration company expanding from three to twelve Texas service areas",
      "A staffing agency with duplicate-content issues across six state pages",
      "A property management company needing a scalable city-page framework ahead of nationwide expansion",
    ],
    internalLinks: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Locations", href: "/locations/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
    ],
    faqs: [
      { question: "How do you avoid duplicate content across locations?", answer: "Every location page is built from real local research — market context, competition, and service specifics — rather than a template with only the city name changed." },
      { question: "Do you claim we have offices in every city?", answer: "No — for service-area businesses without a physical office in a given city, we use accurate service-area language and schema instead of fabricating a local address." },
      { question: "How many locations can this architecture support?", answer: "The framework is built to scale to dozens or hundreds of locations without a redesign, adding pages incrementally as each market is properly researched." },
    ],
  },
  "ai-digital-marketing": {
    slug: "ai-digital-marketing",
    name: "AI Digital Marketing",
    metaTitle: "AI Digital Marketing Services for US Businesses",
    metaDescription:
      "AI-assisted digital marketing services helping US businesses show up in AI search summaries and generative answer engines, not just traditional search results.",
    heroDescription:
      "Positioning your business to show up in AI-generated answers, not just the traditional ten blue links.",
    problem: {
      title: "AI search summarizes your competitors, not you",
      body: "A growing share of searches now surface an AI-generated summary before any traditional results. If your content isn't structured, specific, and well-sourced, AI answer engines simply cite someone else instead.",
    },
    solution: {
      title: "Content and structured data built to be cited, not just crawled",
      body: "We combine clean structured data, clearly defined entities, and content written to directly answer specific questions — the traits AI Overviews and answer engines favor when selecting what to summarize and cite.",
    },
    includes: [
      "AI search visibility audit (current citation and summary presence)",
      "Structured data implementation for entity clarity",
      "Content restructured for direct-answer formatting",
      "FAQ and Q&A content development",
      "Brand entity and authority signal review",
      "Ongoing monitoring of AI search appearances",
    ],
    howItWorks: [
      { step: "01", title: "Assess", body: "We check current visibility across AI Overviews and answer engines for your key queries." },
      { step: "02", title: "Structure", body: "We implement schema and content formatting that supports AI citation." },
      { step: "03", title: "Produce", body: "Content is written to directly and clearly answer specific customer questions." },
      { step: "04", title: "Monitor", body: "We track AI search visibility alongside traditional rankings." },
    ],
    outcomes: [
      "Improved structured data supporting both traditional and AI search",
      "Content formatted in a way answer engines can more easily cite",
      "A clearer, more consistent entity presence across the web",
      "Visibility into how your business appears in AI-generated answers",
    ],
    suitableFor: ["Businesses in competitive, information-heavy categories (legal, medical, financial)", "Companies wanting to future-proof their SEO investment", "Brands with strong content but weak structured data", "Any business noticing AI Overviews increasingly dominate their target searches"],
    examples: [
      "A personal injury firm working to be cited in AI answers about local claims processes",
      "A medical practice restructuring FAQ content for clearer AI extraction",
      "A financial advisory firm strengthening entity signals across its site and profiles",
    ],
    internalLinks: [
      { label: "Content Marketing", href: "/services/content-marketing/" },
      { label: "Technical SEO", href: "/services/technical-seo/" },
      { label: "SEO", href: "/services/seo/" },
    ],
    faqs: [
      { question: "Can you guarantee we'll be cited in AI Overviews?", answer: "No one can guarantee inclusion in a specific AI-generated answer — those systems select sources dynamically. We can meaningfully improve the structural and content factors that make citation more likely." },
      { question: "Is this separate from regular SEO?", answer: "It builds directly on strong technical and content SEO — clean structured data and clear, well-organized content benefit both traditional and AI search simultaneously." },
      { question: "How do you measure success here?", answer: "We track appearances and citations in AI Overviews and answer engines for your priority queries, alongside traditional ranking and traffic metrics." },
    ],
  },
};

export function getServiceContent(slug: string) {
  return SERVICE_CONTENT[slug];
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
