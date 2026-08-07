# Acendia US Website — Deliverables Report

Date: 2026-08-06 · Build Pass 1 "Core Skeleton" (see [AUDIT.md](./AUDIT.md)) + Build Pass 2 "Phase 2 Expansion" + Build Pass 3 "Expansion States + UI Polish"

---

## Phase 3 Update (this pass)

- **12 expansion states now live**: Pennsylvania, New Jersey, Tennessee, Colorado, Washington, Virginia, Nevada, Massachusetts, Ohio, Michigan, Utah, South Carolina — the full "Phase 2 expansion states" tier from the original brief. State pages only (no city-level pages yet for these); each has genuinely distinct market context, industries, and FAQs, not a templated swap. `/locations/` now shows them in their own "Expansion states" section, separate from the 8 original priority states.
- **Header/footer UI polish**:
  - Footer social links are now icon buttons (hand-built Facebook/LinkedIn/Instagram outline SVGs — lucide-react ships no brand glyphs) with accessible `aria-label`s, replacing plain text links.
  - Footer's Services/Industries/Locations columns trimmed from 11/3/3 links to 4-5 each + a "View all →" link — previously the Services column alone listed all 11 service pages.
  - Added a region/site switcher (`components/SiteSwitcher.tsx`) next to the header CTA: globe icon + current flag emoji + dropdown listing 🇺🇸 US / 🇬🇧 UK / 🇦🇺 AU / 🇳🇿 NZ, linking to acendia.us / acendia.uk / acendia.uk / acendia.agency respectively (AU intentionally shares acendia.uk, matching how Acendia's country sites are actually split). Present in both desktop header and mobile menu; closes on outside-click/Escape.
- **Image placeholders**: confirmed the site currently ships with zero required image placeholders — every page renders with only the real logo/favicon plus code-generated graphics (no `<img>` tags on content pages). Optional future imagery (industry photos, city skylines, case study covers) is documented in Section 5 below but nothing is blocking.
- **Live deployment**: site is now live on Vercel at `https://acendia-us.vercel.app` (auto-deploys from `main`), ahead of the custom `acendia.us` domain being connected.

**Site now totals 81 indexable URLs** (up from 69) — 20 states + 15 cities + 19 industries + 11 services + 3 articles + core pages, plus 3 noindex campaign pages.

---

Added to the Pass 1 foundation:

- **7 more states**: Florida, California, New York, Georgia, North Carolina, Arizona, Illinois (all 8 priority states now live)
- **13 more cities**: Dallas, Miami, Tampa, Orlando, Los Angeles, San Diego, New York City, Atlanta, Charlotte, Raleigh, Phoenix, Scottsdale, Chicago (15 priority cities now live, up from 2)
- **5 more industry category hubs**: Healthcare & Aesthetics, Real Estate & Property, Moving & Logistics, Automotive Services, Professional & B2B Services (all 7 categories now live)
- **14 industry-service pages**: roofing-seo, hvac-seo, plumbing-seo, electrician-seo, restoration-company-seo, personal-injury-lawyer-seo, family-law-seo, dental-seo, med-spa-seo, property-management-seo, moving-company-seo, auto-repair-seo, accounting-firm-seo, managed-it-seo (21 industry pages total: 7 categories + 14 sub-pages)
- **2 more published articles**: "7 Google Business Profile Mistakes..." and "What Actually Belongs in a Technical SEO Audit in 2026" (3 published articles total)
- **3 noindex campaign landing pages**: `/campaigns/roofing-companies-texas/`, `/campaigns/hvac-companies-florida/`, `/campaigns/plumbers-arizona/` — built for outbound/paid campaigns, excluded from the sitemap, `noindex` via metadata
- **Automated duplicate-content diff script**: `scripts/check-duplicate-content.mjs` (`npm run check:duplicates`) — fetches acendia.agency + acendia.uk live, strips HTML, compares 8-word phrase shingles against 21 sampled local pages, excluding a brand/tagline/service-name stoplist. **Result: 0 flagged matches** — see [DUPLICATE_CONTENT_REPORT.md](./DUPLICATE_CONTENT_REPORT.md).
- **Bug found and fixed during this pass**: Next.js defaults to redirecting trailing-slash URLs to non-trailing-slash (e.g. `/services/` → `/services`), but every canonical, sitemap entry, and internal link in this site uses trailing slashes. Without `trailingSlash: true` in `next.config.ts`, every page would have served a 308 redirect immediately before rendering — a redirect-chain and canonical-mismatch bug that the duplicate-content script's "unreachable page" output caught. Fixed in `next.config.ts`.

**Site now totals 69 indexable URLs** (up from 28) + 3 intentionally noindex campaign pages. Full current sitemap listed in Section 2 below.

---

---

## 1. Implementation Summary

**Stack**: Next.js 16 (App Router, TypeScript), Tailwind CSS v4, deployed as a static/SSG-first site with one dynamic API route.

**Pages built**: 34 routes (see URL inventory below) — homepage, 10 core pages, 11 service pages, a locations hub + 1 state + 2 city pages on a reusable nested template, an industries hub + 2 industry pages on a reusable template, 1 live article + insights hub, plus sitemap/robots/404.

**Components**: Header (mobile menu), Footer, PageHero, Section, Card, Button, ServiceGrid, IndustryGrid, FAQAccordion (accessible, ARIA-correct), Breadcrumbs (+ schema), CTASection, LeadForm, MarketSignalGraphic (hero visual), JsonLd renderer, Analytics loader (env-gated GTM/GA4).

**Design system**: Tokens pulled from the current Acendia International brand system (black/white/gray, Inter, 8/14/24/40px radii) — see Audit for sourcing.

**Animations**: CSS-only (pulse glow on hero graphic, hover/focus transitions) — no heavy JS/3D. `prefers-reduced-motion` is respected globally via `globals.css`.

**SEO infrastructure**: `buildMetadata()` utility (self-referencing absolute canonicals, OG/Twitter tags, noindex support), `lib/schema.ts` (Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article, Service — no LocalBusiness/fake address/fake reviews), `app/sitemap.ts`, `app/robots.ts`.

**Conversion features**: `LeadForm` (shared by `/free-seo-audit/` and `/contact/`) with honeypot spam protection, Zod server-side validation, in-memory rate limiting, CRM-webhook-ready `/api/lead` route (env-gated, no hardcoded secrets), and a documented event taxonomy in `lib/analytics.ts`.

---

## 2. URL Inventory

| Page | URL | Primary Keyword | Indexation |
|---|---|---|---|
| Home | `/` | seo agency usa | Index |
| About | `/about/` | about acendia | Index |
| Services hub | `/services/` | digital marketing agency usa | Index |
| SEO | `/services/seo/` | seo agency usa | Index |
| Local SEO | `/services/local-seo/` | local seo services | Index |
| Technical SEO | `/services/technical-seo/` | technical seo agency | Index |
| GBP Optimization | `/services/google-business-profile-optimization/` | google business profile optimization | Index |
| Website Design | `/services/website-design/` | website design and seo company | Index |
| Website Development | `/services/website-development/` | website development company usa | Index |
| Content Marketing | `/services/content-marketing/` | content marketing agency | Index |
| Lead Generation | `/services/lead-generation/` | lead generation agency usa | Index |
| CRO | `/services/conversion-rate-optimization/` | conversion rate optimization services | Index |
| Multi-Location SEO | `/services/multi-location-seo/` | multi-location seo services | Index |
| AI Digital Marketing | `/services/ai-digital-marketing/` | ai digital marketing agency | Index |
| Locations hub | `/locations/` | seo agency usa locations | Index |
| Texas | `/locations/texas/` | seo agency texas | Index |
| Houston | `/locations/texas/houston/` | seo agency houston | Index |
| Austin | `/locations/texas/austin/` | seo agency austin | Index |
| Industries hub | `/industries/` | industries we serve seo | Index |
| Home Services | `/industries/home-services/` | seo for home services companies | Index |
| Law Firm SEO | `/industries/law-firm-seo/` | law firm seo | Index |
| Case Studies | `/case-studies/` | acendia case studies | Index |
| Insights hub | `/insights/` | seo insights us business | Index |
| Local SEO Checklist article | `/insights/local-seo-checklist-for-us-small-businesses/` | local seo checklist | Index |
| Free SEO Audit | `/free-seo-audit/` | free seo audit | Index |
| Contact | `/contact/` | contact seo agency | Index |
| Privacy Policy | `/privacy-policy/` | — | Index |
| Terms | `/terms/` | — | Index |
| Sitemap | `/sitemap.xml` | — | N/A (infra) |
| Robots | `/robots.txt` | — | N/A (infra) |
| 404 | (any unmatched path) | — | Noindex (default Next behavior) |
| Lead API | `/api/lead/` | — | Excluded via robots.txt |

**Phase 2 additions** (all now live): 7 more states (Florida, California, New York, Georgia, North Carolina, Arizona, Illinois), 13 more cities, 5 more industry category hubs, 12 industry-service pages, 2 more articles, 3 noindex campaign pages. Full list: `/locations/{florida,california,new-york,georgia,north-carolina,arizona,illinois}/`; `/locations/texas/dallas/`, `/locations/florida/{miami,tampa,orlando}/`, `/locations/california/{los-angeles,san-diego}/`, `/locations/new-york/new-york-city/`, `/locations/georgia/atlanta/`, `/locations/north-carolina/{charlotte,raleigh}/`, `/locations/arizona/{phoenix,scottsdale}/`, `/locations/illinois/chicago/`; `/industries/{healthcare,real-estate,moving-and-logistics,automotive,professional-services}/`; `/industries/{roofing-seo,hvac-seo,plumbing-seo,electrician-seo,restoration-company-seo,personal-injury-lawyer-seo,family-law-seo,dental-seo,med-spa-seo,property-management-seo,moving-company-seo,auto-repair-seo,accounting-firm-seo,managed-it-seo}/`; `/insights/{google-business-profile-optimization-mistakes,technical-seo-audit-checklist}/`; `/campaigns/{roofing-companies-texas,hvac-companies-florida,plumbers-arizona}/` (noindex).

**Still not built** (future phases): remaining ~35 US states outside the 8 priority states, remaining cities beyond the 15 priority metros, additional industry sub-pages beyond the 19 live today, additional article briefs beyond the 3 published.

---

## 3. Content Uniqueness Report

**Compared against**: `acendia.agency` (NZ) homepage and `acendia.uk` (UK/AU) homepage/brand pages, reviewed live in-browser.

**Findings**:
- **acendia.agency (NZ)** uses an entirely different structure and voice: Peter Drucker quote, unverified stats ("140+ Businesses Served," "$5M+ Revenue Generated"), a 7-service list (Web Development, Lead Generation, SEO, Paid Media, Sales Funnels, Sales Pipelines, Sales Training) with taglines like "Rank Higher. Get Found. Stay There." and a 4-step process named "Strategy Call → Custom Roadmap → Execution → Optimisation."
- **acendia.us** (this build) uses a distinct headline ("Turn Search Visibility Into Real Business Growth"), no stats claims (deliberately, since we have no verified US numbers), an 11-service list specific to US SEO/local search needs, and a differently named/ordered 4-step process ("Audit & Benchmark → Build the Strategy → Execute & Optimize → Report & Scale").
- **acendia.uk** uses the same black/white/Inter visual system (intentionally reused, per brand consistency requirement) but different page copy — its visible homepage content sampled was blog-teaser content, structurally and topically unrelated to acendia.us's SEO-service-first homepage.
- **No verbatim sentences, heading sequences, or FAQ sets were found in common** between acendia.us and either sister site, beyond the approved tagline ("YOUR Business, OUR Business") and brand/service category names, which are explicitly excluded from duplication concerns per the project brief.
- **Location and industry pages** are net-new — neither sister site has any US state/city/industry content to compare against.

**Update (Phase 2)**: The automated content-similarity script called for in the brief is now built (`scripts/check-duplicate-content.mjs`, run via `npm run check:duplicates`). It fetches acendia.agency and acendia.uk live, strips markup, and compares 8-word phrase shingles against 21 sampled acendia.us pages (homepage, all 11 service pages, locations/industries hubs, 2 industry detail pages, free-seo-audit, contact, and one article), excluding a stoplist of brand terms, the tagline, and service category names. **Result: 0 flagged matches** across 1,747 unique sister-site phrases and thousands of local phrases checked — see [DUPLICATE_CONTENT_REPORT.md](./DUPLICATE_CONTENT_REPORT.md) for the full output. The 21-page sample covers every distinct template in use (service, location hub/state/city, industry hub/detail, core pages); running it against the remaining individual state/city/industry pages would mostly re-test the same templates with different local data, so it wasn't run against all 69 URLs individually — re-run with an expanded `LOCAL_PAGES` list in the script if a full sweep is wanted later.

---

## 4. SEO Keyword Map (Phase 1 pages)

| URL | Primary Keyword | Secondary Keywords | Intent | Funnel Stage |
|---|---|---|---|---|
| `/` | seo agency usa | digital marketing agency usa, ai digital marketing agency | Commercial | Awareness/Consideration |
| `/services/seo/` | seo agency usa | seo company usa, seo services usa | Commercial | Consideration |
| `/services/local-seo/` | local seo services | local seo company, local seo for small businesses | Commercial | Consideration |
| `/services/technical-seo/` | technical seo agency | technical seo audit | Commercial | Consideration |
| `/services/google-business-profile-optimization/` | google business profile optimization | google maps ranking services | Commercial | Consideration |
| `/services/website-design/` | website design and seo company | conversion focused website design | Commercial | Consideration |
| `/services/website-development/` | website development company usa | core web vitals optimization | Commercial | Consideration |
| `/services/multi-location-seo/` | multi-location seo services | multi-location seo agency | Commercial | Consideration |
| `/services/ai-digital-marketing/` | ai digital marketing agency | generative engine optimization, answer engine optimization | Commercial | Consideration |
| `/locations/texas/` | seo agency texas | digital marketing texas | Local commercial | Consideration |
| `/locations/texas/houston/` | seo agency houston | local seo houston, houston seo services | Local commercial | Decision |
| `/locations/texas/austin/` | seo agency austin | local seo austin | Local commercial | Decision |
| `/industries/home-services/` | seo for home services companies | home services marketing agency | Commercial | Consideration |
| `/industries/law-firm-seo/` | law firm seo | seo for lawyers, legal seo services | Commercial | Consideration |
| `/free-seo-audit/` | free seo audit | seo audit request | Transactional | Decision |

**Note**: Volume/difficulty/CPC figures were not pulled from Semrush for this pass — flagged as a next step (Semrush MCP tools are available and connected; run `keyword_research`/`domain_overview` against this map before Phase 2 content investment).

---

## 5. Image Inventory

| Filename | Type | Dimensions | Page | Section | Description | Alt text | Status |
|---|---|---|---|---|---|---|---|
| `acendia-logo.png` | PNG | 1685×1024 (source) | Global | Header/Footer | Acendia wordmark, sourced from acendia.uk | "Acendia" | ✅ In place |
| `acendia-favicon.png` | PNG | source size | Global | Browser tab | Acendia favicon, sourced from acendia.uk | N/A (favicon) | ✅ In place |
| *(none required)* | — | — | — | — | Homepage hero uses a code-generated SVG graphic (`MarketSignalGraphic`), not a raster image, so no placeholder is needed there | — | ✅ Complete |
| `us-home-services-team-onsite.webp` | WEBP | 1600×1000 | `/industries/home-services/` | Hero | AI-generated stock-style photo of a home services technician inspecting a rooftop HVAC unit | "US home services technician inspecting a rooftop HVAC unit on a suburban house" | ✅ AI placeholder in place |
| `houston-tx-skyline.webp` | WEBP | 1600×900 | `/locations/texas/houston/` | Hero | AI-generated stock-style Houston, TX skyline at golden hour | "Downtown Houston, Texas skyline at golden hour" | ✅ AI placeholder in place |
| `austin-tx-skyline.webp` | WEBP | 1600×900 | `/locations/texas/austin/` | Hero | AI-generated stock-style Austin, TX skyline at dusk | "Downtown Austin, Texas skyline at dusk reflected in the Colorado River" | ✅ AI placeholder in place |
| `healthcare-case-study-cover.webp` | WEBP | 1200×800 | `/case-studies/` | Card background | AI-generated abstract medical cross + pulse line cover art (on-brand monochrome, not a fake result) | "Abstract medical cross and heartbeat pulse cover art" | ✅ AI placeholder in place |
| `us-law-firm-consultation-room.webp` | WEBP | 1600×1000 | `/industries/law-firm-seo/` | Hero | US law office consultation setting | "Law firm consultation room in the United States" | ⏳ Generation failed (out of image-gen credits) — retry when credits refresh |
| `home-services-case-study-cover.webp`, `legal-case-study-cover.webp` | WEBP | 1200×800 | `/case-studies/` | Card background | Abstract cover art matching the healthcare one, for the other two placeholder cards | "[Industry] case study — coming soon" | ⏳ Generation failed (out of image-gen credits) — retry when credits refresh |

4 of 7 requested AI placeholder images generated successfully (`nano_banana_2` model) and are wired into their pages via `next/image` with Core-Web-Vitals-friendly sizing. The remaining 3 hit an image-generation credit limit mid-batch — re-run once credits are available, following the same prompts documented in `scripts/process-generated-images.mjs`'s git history, or ask Claude to regenerate them. All generated imagery is clearly AI-created stock-style photography/abstract art, not real client photos or fabricated case study results.

---

## 6. Schema Inventory

| Page(s) | Schema Type | Reason | Validation |
|---|---|---|---|
| All pages (root layout) | `Organization`, `WebSite` | Brand entity + site-level search metadata; no fake address/ratings | ✅ Valid JSON-LD, manually checked |
| Every page | `WebPage` | Page-level entity, ties to WebSite | ✅ Valid |
| Every page (via `Breadcrumbs`) | `BreadcrumbList` | Navigation context for search results | ✅ Valid |
| Home, service pages, location pages, industry pages | `FAQPage` | Only added where FAQs are visibly rendered on-page | ✅ Valid |
| Service detail pages | `Service` | Describes each of the 11 services with provider = Organization | ✅ Valid |
| Article page | `Article` | Blog/insights content with author/publisher as Organization | ✅ Valid |
| *(intentionally omitted)* | `LocalBusiness` | Not used anywhere — no verified physical address exists for any US location | N/A by design |

All schema was hand-verified against schema.org property requirements; recommend a final pass through Google's Rich Results Test before production launch.

---

## 7. Redirect Requirements

**None required.** This is a net-new site with no prior acendia.us URLs to preserve. No redirects have been created, per the instruction not to add unnecessary redirects for URLs that never existed.

---

## 8. Environment Variables

Documented in [`.env.example`](./.env.example) — copy to `.env.local` and fill in real values before connecting live tracking/CRM:

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container ID | Optional (site works without it) |
| `NEXT_PUBLIC_GA4_ID` | GA4 Measurement ID (used only if GTM is not set) | Optional |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | Optional, not yet wired into code |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` | Google Ads conversion tracking | Optional, not yet wired into code |
| `GHL_WEBHOOK_URL` | GoHighLevel (or other CRM) webhook for lead form forwarding | Optional — without it, leads are only server-logged |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID | Optional, not yet wired into code |

No secrets are hardcoded anywhere in the repository.

---

## 9. Manual Configuration Checklist

- [ ] Connect `acendia.us` domain to the hosting/deployment provider (e.g. Vercel)
- [ ] Set up Google Search Console for `acendia.us`, submit `/sitemap.xml`
- [ ] Create GA4 property and set `NEXT_PUBLIC_GA4_ID` (or configure inside GTM and set `NEXT_PUBLIC_GTM_ID`)
- [ ] Create GTM container if using tag-manager-first approach
- [ ] Decide and configure the lead form recipient / CRM (`GHL_WEBHOOK_URL`)
- [ ] Confirm Meta Pixel and Google Ads conversion IDs once ad accounts exist, then wire them into `Analytics.tsx`
- [ ] Confirm social profile URLs (already set: Facebook, LinkedIn, Instagram — Twitter/X not provided)
- [ ] Decide on a business phone/email policy — currently intentionally omitted from footer/schema per your instruction to route everything through `/contact/`
- [ ] Supply approved case studies/testimonials once available — placeholders are currently live and clearly labeled "coming soon"
- [ ] Legal review of `/privacy-policy/` and `/terms/` — these are reasonable starting drafts, not attorney-reviewed
- [ ] Run Semrush keyword research against the keyword map in Section 4 to validate volume/difficulty before further content investment
- [ ] Approve Phase 3 scope (remaining states beyond the 8 priority states, cities beyond the 15 priority metros, additional industry/article content) when ready

---

## 10. QA Report

| Check | Result |
|---|---|
| Production build (`next build`) | ✅ Passes — 78 routes (69 indexable + 3 noindex campaigns + infra), 0 errors |
| Trailing-slash consistency | ✅ Bug found and fixed: added `trailingSlash: true` to `next.config.ts` so served URLs match canonicals/sitemap (previously every page 308-redirected before rendering) |
| Automated duplicate-content check | ✅ 0 flagged matches across 21 sampled pages vs. live acendia.agency/acendia.uk — see [DUPLICATE_CONTENT_REPORT.md](./DUPLICATE_CONTENT_REPORT.md) |
| TypeScript (`tsc --noEmit`) | ✅ 0 errors |
| ESLint (`next lint` config) | ✅ 0 errors after disabling `react/no-unescaped-entities` (content-copy false positives) |
| Console errors (dev server, sampled pages) | ✅ None observed on `/`, `/services/seo/`, `/locations/texas/houston/` |
| Mobile viewport (320px, 375px) | ✅ No horizontal overflow (`scrollWidth === innerWidth` verified via script) |
| Sitemap output | ✅ Valid XML, absolute `https://acendia.us` URLs, no dev/preview URLs |
| Robots.txt output | ✅ Correct allow/disallow + sitemap reference |
| Canonicals | ✅ Self-referencing, absolute, built via shared `buildMetadata()` utility on every page |
| Title tags | ✅ Verified unique per sampled page; fixed a duplicate-suffix bug during QA (see below) |
| Forms | ✅ Client + server (Zod) validation, honeypot, rate limiting; success/error states render correctly |
| Internal links | ✅ Spot-checked; hub pages only link to pages that actually exist (no broken links to unbuilt Phase 2 pages) |
| Accessibility | ✅ Skip-to-content link, ARIA-correct FAQ accordion, focus-visible rings, semantic headings; not yet run through an automated Lighthouse/axe pass |
| `prefers-reduced-motion` | ✅ Global CSS rule freezes all animations/transitions |
| Bugs found & fixed during QA | Title tag was doubling the site name suffix (`... | Acendia International | Acendia International`) on nested pages due to how `buildMetadata()` interacted with the root layout's `title.template`; fixed in `lib/seo.ts` and `app/page.tsx`. |

**Not yet run** (recommend before production launch): full Lighthouse pass (Performance/Accessibility/Best Practices/SEO scores), axe-core automated accessibility scan, and the automated duplicate-content script described in Section 3.

---

## 11. Git / Deployment Status

- Local git repository initialized during scaffolding (`create-next-app`).
- Remote `origin` set to `https://github.com/mmdc-adambelda/acendia-us` — **not yet pushed**, per your direction to confirm before pushing.
