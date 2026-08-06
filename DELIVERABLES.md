# Acendia US Website — Deliverables Report (Build Pass 1: Core Skeleton)

Date: 2026-08-06 · Scope agreed with client: "Core skeleton first" (see [AUDIT.md](./AUDIT.md))

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

**Not yet built** (Phase 2 — full rollout per original brief): remaining 7 priority states, 13 priority cities, 5 remaining industry categories + ~9 industry-service pages, 2 more articles, campaign landing-page templates. See Section 9.

---

## 3. Content Uniqueness Report

**Compared against**: `acendia.agency` (NZ) homepage and `acendia.uk` (UK/AU) homepage/brand pages, reviewed live in-browser.

**Findings**:
- **acendia.agency (NZ)** uses an entirely different structure and voice: Peter Drucker quote, unverified stats ("140+ Businesses Served," "$5M+ Revenue Generated"), a 7-service list (Web Development, Lead Generation, SEO, Paid Media, Sales Funnels, Sales Pipelines, Sales Training) with taglines like "Rank Higher. Get Found. Stay There." and a 4-step process named "Strategy Call → Custom Roadmap → Execution → Optimisation."
- **acendia.us** (this build) uses a distinct headline ("Turn Search Visibility Into Real Business Growth"), no stats claims (deliberately, since we have no verified US numbers), an 11-service list specific to US SEO/local search needs, and a differently named/ordered 4-step process ("Audit & Benchmark → Build the Strategy → Execute & Optimize → Report & Scale").
- **acendia.uk** uses the same black/white/Inter visual system (intentionally reused, per brand consistency requirement) but different page copy — its visible homepage content sampled was blog-teaser content, structurally and topically unrelated to acendia.us's SEO-service-first homepage.
- **No verbatim sentences, heading sequences, or FAQ sets were found in common** between acendia.us and either sister site, beyond the approved tagline ("YOUR Business, OUR Business") and brand/service category names, which are explicitly excluded from duplication concerns per the project brief.
- **Location and industry pages** are net-new — neither sister site has any US state/city/industry content to compare against.

**Remaining manual-review item**: This was a manual, in-browser comparison of homepages and available brand pages, not an automated crawl-and-diff. Before Phase 2 (bulk state/city/industry expansion), build the automated content-similarity script the brief calls for (fetch + strip HTML + n-gram overlap check against acendia.agency/acendia.uk, excluding brand terms) so higher page volumes don't need manual spot-checks.

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
| `us-home-services-team-onsite.webp` | WEBP | 1600×1000 | `/industries/home-services/` | Hero/body | Real US home-services technician on a job site | "US home services technician completing a job onsite" | ⏳ Placeholder needed |
| `us-law-firm-consultation-room.webp` | WEBP | 1600×1000 | `/industries/law-firm-seo/` | Hero/body | US law office consultation setting | "Law firm consultation room in the United States" | ⏳ Placeholder needed |
| `houston-tx-skyline.webp` | WEBP | 1600×900 | `/locations/texas/houston/` | Hero | Houston, TX skyline | "Houston, Texas skyline" | ⏳ Placeholder needed |
| `austin-tx-skyline.webp` | WEBP | 1600×900 | `/locations/texas/austin/` | Hero | Austin, TX skyline | "Austin, Texas skyline" | ⏳ Placeholder needed |
| `[industry]-case-study-cover.webp` (×3) | WEBP | 1200×800 | `/case-studies/` | Cards | Placeholder cover art for pending case studies | "[Industry] case study — coming soon" | ⏳ Deferred until real results exist |

Currently the site ships with **zero unlicensed/placeholder-risk imagery** — every visual element is either the real brand logo/favicon or a code-generated graphic. The rows above are the recommended next additions once real, licensed photography is available.

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
- [ ] Run Semrush keyword research against the keyword map in Section 4 to validate volume/difficulty before Phase 2 content investment
- [ ] Approve Phase 2 scope: remaining 7 states, 13 cities, 5 industry categories, additional articles, campaign landing pages

---

## 10. QA Report

| Check | Result |
|---|---|
| Production build (`next build`) | ✅ Passes — 34 routes, 0 errors |
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
