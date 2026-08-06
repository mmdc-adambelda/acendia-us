export type CityContent = {
  slug: string;
  city: string;
  stateSlug: string;
  stateName: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  marketContext: string;
  industries: string[];
  challenges: { title: string; body: string }[];
  opportunities: string[];
  recommendedServices: { label: string; href: string }[];
  nearbyMarkets: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
};

export type StateContent = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  marketContext: string;
  industries: string[];
  cities: { label: string; href: string }[];
  faqs: { question: string; answer: string }[];
};

export const STATE_CONTENT: Record<string, StateContent> = {
  texas: {
    slug: "texas",
    name: "Texas",
    metaTitle: "SEO Agency Texas | Digital Marketing for Texas Businesses",
    metaDescription:
      "SEO and digital marketing services for businesses across Texas — from Houston and Dallas to Austin and San Antonio. Local search, web design, and lead generation.",
    heroDescription:
      "Texas has one of the country's largest and fastest-growing small business economies — and one of the most competitive local search landscapes to match.",
    marketContext:
      "Texas's combination of no state income tax, rapid population growth, and a sprawling geography of distinct metro markets creates a specific SEO challenge: businesses often need to compete across multiple, very different cities rather than one homogenous market. A roofing company serving Houston, Austin, and San Antonio is effectively fighting three separate local search battles at once, each with its own competitive set and search behavior.",
    industries: ["Home services (roofing, HVAC, foundation repair)", "Legal services", "Real estate and property management", "Oil & gas adjacent professional services", "Healthcare and dental"],
    cities: [
      { label: "Houston, TX", href: "/locations/texas/houston/" },
      { label: "Austin, TX", href: "/locations/texas/austin/" },
    ],
    faqs: [
      { question: "Does Acendia have an office in Texas?", answer: "We don't operate a physical office in Texas — we work remotely with Texas businesses across the state, which lets us serve markets from Houston to El Paso without geographic limits." },
      { question: "Which Texas industries do you focus on?", answer: "We concentrate on home services, legal, real estate, and healthcare — categories where local search visibility has a direct, measurable connection to lead value." },
      { question: "Do you serve smaller Texas markets outside the major metros?", answer: "Yes — our local SEO approach applies to any Texas city or service area, though our deepest current market research is focused on Houston and Austin, with more cities being added." },
    ],
  },
};

export const CITY_CONTENT: Record<string, CityContent> = {
  "texas/houston": {
    slug: "houston",
    city: "Houston",
    stateSlug: "texas",
    stateName: "Texas",
    metaTitle: "SEO Agency Houston | Local SEO Services for Houston Businesses",
    metaDescription:
      "SEO and local search services for Houston businesses — home services, legal, healthcare, and real estate companies competing across Houston's sprawling metro market.",
    heroDescription:
      "Houston is the fourth-largest city in the US and one of the most fragmented metro markets for local search — winning here means winning across dozens of distinct neighborhoods.",
    marketContext:
      "Houston's metro area spans over 10,000 square miles with no single dominant commercial center, which means \"ranking in Houston\" often really means ranking well across a patchwork of neighborhoods — the Heights, Katy, Sugar Land, The Woodlands, and dozens more — each with its own local competition. Businesses that treat Houston as one search market typically underperform against competitors who've built genuine neighborhood-level visibility.",
    industries: ["Home services and storm/water damage restoration", "Oil & gas adjacent B2B services", "Healthcare and medical specialists", "Legal services, particularly personal injury", "Real estate and property management"],
    challenges: [
      { title: "Geographic fragmentation", body: "A single \"Houston\" landing page rarely captures the neighborhood-specific intent behind searches like \"plumber near Katy\" or \"HVAC repair The Woodlands.\"" },
      { title: "Storm-driven demand spikes", body: "Weather events create sudden surges in demand for roofing, restoration, and HVAC services — businesses without a strong existing local profile miss much of this traffic." },
      { title: "Heavy local competition", body: "Houston's business density means most service categories have dozens of established local competitors already investing in SEO." },
    ],
    opportunities: [
      "Neighborhood-specific service pages for high-value submarkets (Katy, Sugar Land, The Woodlands)",
      "Google Business Profile optimization built around Houston's storm-driven search spikes",
      "Local link building through Houston-based industry associations and directories",
      "Review generation strategies tuned to Houston's high-competition categories",
    ],
    recommendedServices: [
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Google Business Profile Optimization", href: "/services/google-business-profile-optimization/" },
      { label: "Multi-Location SEO", href: "/services/multi-location-seo/" },
    ],
    nearbyMarkets: [
      { label: "Texas", href: "/locations/texas/" },
      { label: "Austin, TX", href: "/locations/texas/austin/" },
    ],
    faqs: [
      { question: "Do you serve businesses throughout the entire Houston metro?", answer: "Yes — we work with businesses serving Houston and its surrounding submarkets, including Katy, Sugar Land, and The Woodlands, without requiring a physical office in any specific neighborhood." },
      { question: "How do you handle Houston's neighborhood-level competition?", answer: "We build genuinely distinct content and local signals for each submarket you serve rather than a single generic Houston page, which is what actually earns visibility at the neighborhood level." },
      { question: "Can you help with demand spikes after storms?", answer: "We can help restoration, roofing, and HVAC businesses strengthen their Google Business Profile and local content ahead of storm season, though we can't control or predict specific weather-driven demand." },
    ],
  },
  "texas/austin": {
    slug: "austin",
    city: "Austin",
    stateSlug: "texas",
    stateName: "Texas",
    metaTitle: "SEO Agency Austin | Local SEO Services for Austin Businesses",
    metaDescription:
      "SEO and local search services for Austin, TX businesses — from home services to professional services competing in one of the country's fastest-growing metros.",
    heroDescription:
      "Austin's population and business growth have outpaced its search competition maturity in some categories — creating real opportunity for businesses that move on SEO early.",
    marketContext:
      "Austin has grown faster than almost any major US metro over the past decade, with new residents and new businesses arriving continuously. That growth cuts both ways for SEO: search volume for local services keeps climbing, but so does the number of competitors — many of them recently arrived and not yet locally established, which creates a window for businesses willing to invest in local search now.",
    industries: ["Professional and B2B services (consulting, IT, staffing)", "Home services", "Healthcare and med spas", "Real estate", "Legal services"],
    challenges: [
      { title: "New-resident search behavior", body: "A large share of Austin's population has lived there under five years, meaning brand loyalty is low and search-driven discovery matters more than in more established metros." },
      { title: "Rapidly shifting competitive set", body: "New businesses enter the Austin market constantly, so a Map Pack position that's stable today can shift within a quarter." },
      { title: "Suburban sprawl", body: "Growth into suburbs like Round Rock, Cedar Park, and Georgetown means businesses need a deliberate strategy for whether and how to compete in those submarkets too." },
    ],
    opportunities: [
      "Early local SEO investment in categories where competitors haven't yet established authority",
      "Content targeting new-resident search behavior (\"best [service] in Austin\" style queries)",
      "Google Business Profile optimization to capture Map Pack share while the competitive set is still forming",
      "Suburban expansion pages for Round Rock, Cedar Park, and Georgetown where relevant",
    ],
    recommendedServices: [
      { label: "SEO", href: "/services/seo/" },
      { label: "Local SEO", href: "/services/local-seo/" },
      { label: "Website Design", href: "/services/website-design/" },
    ],
    nearbyMarkets: [
      { label: "Texas", href: "/locations/texas/" },
      { label: "Houston, TX", href: "/locations/texas/houston/" },
    ],
    faqs: [
      { question: "Is Austin's SEO competition less intense than Houston or Dallas?", answer: "It varies by category — some Austin niches remain relatively open given how recently many competitors arrived, while established categories like legal and healthcare are highly competitive." },
      { question: "Do you help with suburban Austin markets like Round Rock or Cedar Park?", answer: "Yes — we can build out a suburban expansion strategy once your core Austin presence is established, using genuinely distinct local content rather than templated pages." },
      { question: "How fast can we expect to see movement in Austin specifically?", answer: "Because Austin's competitive set is still forming in many categories, some businesses see faster initial movement here than in more mature metros — though this varies by industry and starting position." },
    ],
  },
};
