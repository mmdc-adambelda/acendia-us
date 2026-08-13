# Image Inventory — What's Missing, Filenames, and ChatGPT Prompts

Updated: 2026-08-13 (v4 — GBP mistakes article now has both its featured and inline images)

## What changed in this pass

You uploaded 25 images (20 industry photos + 5 city skylines). All were resized to spec and wired in — **every industry page now has a real photo**. Pages still without a real photo show a code-generated placeholder (a subtle icon on the site's black/grid background) — nothing is broken or blank.

## Where images already exist (real photos, no action needed)

| File | Used on |
|---|---|
| `public/brand/acendia-logo.png` / `acendia-favicon.png` | Header, footer, favicon |
| `us-home-services-team-onsite.png` | `/industries/home-services/` |
| `us-law-firm-consultation-room.png` | `/industries/law-firm-seo/` |
| `us-medical-practice-exam-room.png` | `/industries/healthcare/` |
| `us-real-estate-agent-showing-home.png` | `/industries/real-estate/` |
| `us-moving-company-loading-truck.png` | `/industries/moving-and-logistics/` |
| `us-auto-repair-shop-technician.png` | `/industries/automotive/` |
| `us-professional-services-office-meeting.png` | `/industries/professional-services/` |
| `us-roofing-contractor-on-roof.png` | `/industries/roofing-seo/` |
| `us-hvac-technician-indoor-unit.png` | `/industries/hvac-seo/` |
| `us-plumber-under-sink-repair.png` | `/industries/plumbing-seo/` |
| `us-electrician-panel-upgrade.png` | `/industries/electrician-seo/` |
| `us-water-damage-restoration-crew.png` | `/industries/restoration-company-seo/` |
| `us-personal-injury-attorney-office.png` | `/industries/personal-injury-lawyer-seo/` |
| `us-family-law-attorney-meeting.png` | `/industries/family-law-seo/` |
| `us-dental-practice-checkup.png` | `/industries/dental-seo/` |
| `us-med-spa-treatment-room.png` | `/industries/med-spa-seo/` |
| `us-property-manager-inspection.png` | `/industries/property-management-seo/` |
| `us-movers-carrying-furniture.png` | `/industries/moving-company-seo/` |
| `us-auto-repair-brake-service.png` | `/industries/auto-repair-seo/` |
| `us-accounting-firm-consultation.png` | `/industries/accounting-firm-seo/` |
| `us-managed-it-server-room.png` | `/industries/managed-it-seo/` |
| `houston-tx-skyline.png` | `/locations/texas/houston/` |
| `austin-tx-skyline.png` | `/locations/texas/austin/` |
| `dallas-tx-skyline.png` | `/locations/texas/dallas/` |
| `miami-fl-skyline.png` | `/locations/florida/miami/` |
| `tampa-fl-skyline.png` | `/locations/florida/tampa/` |
| `orlando-fl-skyline.png` | `/locations/florida/orlando/` |
| `los-angeles-ca-skyline.png` | `/locations/california/los-angeles/` |
| `healthcare-case-study-cover.png` | `/case-studies/` (Healthcare card) |

**All industry pages (21 of 21) are complete.** Remaining gaps are cities (8 of 15), states (20 of 20), services (11 of 11), articles (3 of 3), and case-study covers (6 of 7).

## Where to save new files

Save everything to **`public/images/`** (flat folder, no subfolders). Use the exact filenames below — exact spelling matters (one earlier upload had a missing hyphen and needed correcting). Once files are there, tell me — I resize to spec and wire them in.

## How to generate with ChatGPT

1. Paste the prompt from the tables below into ChatGPT (with image generation).
2. Ask for **landscape / widescreen** orientation — exact pixel dimensions aren't critical, I crop precisely on my end.
3. Download the PNG, save to `public/images/` with the exact filename, tell me it's ready.

**Style prefix for all photo prompts** (prepend to every one below unless noted otherwise):
> "Photorealistic, high-end commercial stock photography style, natural lighting, sharp focus, no visible logos, no text overlays, no watermarks —"

**Style prefix for abstract cover art** (case study covers only):
> "Abstract minimalist premium brand cover art, pure black background, subtle thin white glowing geometric line-art outline, clean modern monochrome design, no text, no people, no logos —"

---

## 1. City pages — 8 of 15 still missing (1600×900)

| Page | Filename | Prompt subject |
|---|---|---|
| `/locations/california/san-diego/` | `san-diego-ca-skyline.png` | downtown San Diego skyline with the bay and boats in the foreground at sunset |
| `/locations/new-york/new-york-city/` | `new-york-city-ny-skyline.png` | the Manhattan skyline at dusk with city lights turning on |
| `/locations/georgia/atlanta/` | `atlanta-ga-skyline.png` | downtown Atlanta, Georgia skyline at golden hour |
| `/locations/north-carolina/charlotte/` | `charlotte-nc-skyline.png` | downtown Charlotte, North Carolina skyline at dusk |
| `/locations/north-carolina/raleigh/` | `raleigh-nc-skyline.png` | downtown Raleigh, North Carolina skyline at golden hour |
| `/locations/arizona/phoenix/` | `phoenix-az-skyline.png` | downtown Phoenix, Arizona skyline at sunset with desert mountains behind |
| `/locations/arizona/scottsdale/` | `scottsdale-az-skyline.png` | upscale desert cityscape of Scottsdale, Arizona at golden hour, palm-lined streets, desert mountains behind |
| `/locations/illinois/chicago/` | `chicago-il-skyline.png` | the Chicago skyline from the lakefront at golden hour |

All: append "no people, no text" to the end of the prompt.

## 2. State pages — 20 of 20 missing (1600×900)

One representative landmark/skyline/landscape image per state works well here (can differ from the city image if the state has a covered city already — e.g., Texas can use a different city than Houston/Dallas/Austin, like San Antonio's River Walk).

| Page | Filename | Prompt subject |
|---|---|---|
| `/locations/texas/` | `texas-state-hero.png` | San Antonio River Walk at golden hour, iconic Texas riverside architecture |
| `/locations/florida/` | `florida-state-hero.png` | a palm-lined Florida coastline at sunset, turquoise water |
| `/locations/california/` | `california-state-hero.png` | the Golden Gate Bridge, San Francisco, at golden hour |
| `/locations/new-york/` | `new-york-state-hero.png` | Niagara Falls, New York, wide landscape shot, daytime |
| `/locations/georgia/` | `georgia-state-hero.png` | downtown Savannah, Georgia's historic riverfront at golden hour |
| `/locations/north-carolina/` | `north-carolina-state-hero.png` | the Blue Ridge Mountains, North Carolina, at sunrise |
| `/locations/arizona/` | `arizona-state-hero.png` | Camelback Mountain, Arizona, desert landscape at golden hour |
| `/locations/illinois/` | `illinois-state-hero.png` | the Chicago Riverwalk at golden hour |
| `/locations/pennsylvania/` | `pennsylvania-state-hero.png` | downtown Philadelphia skyline at dusk |
| `/locations/new-jersey/` | `new-jersey-state-hero.png` | the Jersey Shore boardwalk at golden hour |
| `/locations/tennessee/` | `tennessee-state-hero.png` | downtown Nashville, Tennessee skyline at dusk |
| `/locations/colorado/` | `colorado-state-hero.png` | downtown Denver, Colorado with the Rocky Mountains behind at golden hour |
| `/locations/washington/` | `washington-state-hero.png` | downtown Seattle skyline with Mount Rainier in the background at sunset |
| `/locations/virginia/` | `virginia-state-hero.png` | the Northern Virginia / DC-adjacent skyline at dusk |
| `/locations/nevada/` | `nevada-state-hero.png` | the Las Vegas Strip skyline at dusk |
| `/locations/massachusetts/` | `massachusetts-state-hero.png` | downtown Boston skyline along the Charles River at golden hour |
| `/locations/ohio/` | `ohio-state-hero.png` | downtown Columbus, Ohio skyline at dusk |
| `/locations/michigan/` | `michigan-state-hero.png` | downtown Detroit, Michigan skyline along the riverfront at golden hour |
| `/locations/utah/` | `utah-state-hero.png` | downtown Salt Lake City with the Wasatch Mountains behind at sunset |
| `/locations/south-carolina/` | `south-carolina-state-hero.png` | historic downtown Charleston, South Carolina at golden hour |

All: append "wide landscape shot, no people, no text" to the end of the prompt.

## 3. Service pages — 11 of 11 missing (1600×1000)

These are more abstract/conceptual than industry or location pages — a literal "person pointing at a chart" stock photo tends to look generic, so these lean toward clean, real work-in-progress shots instead.

| Page | Filename | Prompt subject |
|---|---|---|
| `/services/seo/` | `us-seo-strategy-session.png` | a marketer reviewing SEO analytics and keyword data on a laptop and external monitor, modern office, focused expression |
| `/services/local-seo/` | `us-local-seo-map-review.png` | a marketer reviewing a local map-pack search results screen alongside a laptop, modern office |
| `/services/technical-seo/` | `us-technical-seo-code-review.png` | a developer reviewing website performance and code on a large monitor, dark-mode code editor visible, modern office |
| `/services/google-business-profile-optimization/` | `us-gbp-profile-management.png` | a marketer updating a Google Business Profile listing on a laptop, coffee shop or storefront visible through a window in the background |
| `/services/website-design/` | `us-website-design-workspace.png` | a designer reviewing website mockups and wireframes on a large monitor, clean modern desk setup, natural light |
| `/services/website-development/` | `us-website-development-workspace.png` | a developer writing code on a dual-monitor setup, dark-mode editor, modern office, focused |
| `/services/content-marketing/` | `us-content-marketing-writing.png` | a content writer typing at a laptop with an editorial calendar visible on a second screen, bright modern office |
| `/services/lead-generation/` | `us-lead-generation-dashboard.png` | a marketer reviewing a lead-tracking dashboard with charts and contact cards on a large monitor |
| `/services/conversion-rate-optimization/` | `us-conversion-rate-ab-testing.png` | a marketer reviewing A/B test results and heatmap data on a monitor, modern office |
| `/services/multi-location-seo/` | `us-multi-location-seo-planning.png` | a marketer reviewing a US map with multiple highlighted city markers on a large screen, planning session |
| `/services/ai-digital-marketing/` | `us-ai-marketing-workspace.png` | a marketer working alongside an AI writing/analytics assistant interface on a laptop, modern minimal office, subtle blue accent lighting |

All: append "no people's faces in extreme close-up, no visible screen text/UI detail, no logos" to the end of the prompt.

## 4. Article featured images — 2 of 3 missing (1600×900)

`/insights/google-business-profile-optimization-mistakes/` is done: `gbp-mistakes-featured.png` (hero, 1672×941) + `gbp-mistakes-content.png` (inline, after mistake #3, 1092×593), both wired into `app/insights/google-business-profile-optimization-mistakes/page.tsx`.

| Page | Filename | Prompt subject |
|---|---|---|
| `/insights/local-seo-checklist-for-us-small-businesses/` | `local-seo-checklist-featured.png` | a small business owner checking a local search results page on a tablet in their storefront, warm natural light |
| `/insights/technical-seo-audit-checklist/` | `technical-seo-checklist-featured.png` | a developer's dual-monitor setup showing website performance charts and code, dark-mode editor, focused workspace |

## 5. Case study covers — 6 of 7 missing (1200×800, abstract not photos)

Use the **abstract style prefix** from above, not the photo one.

| Card | Filename | Subject |
|---|---|---|
| Home Services | `home-services-case-study-cover.png` | a stylized house and roof silhouette outline |
| Legal | `legal-case-study-cover.png` | stylized scales of justice |
| Real Estate & Property | `real-estate-case-study-cover.png` | a stylized building/skyline silhouette outline |
| Moving & Logistics | `moving-logistics-case-study-cover.png` | a stylized moving truck or shipping box outline |
| Automotive Services | `automotive-case-study-cover.png` | a stylized car silhouette outline |
| Professional & B2B Services | `professional-services-case-study-cover.png` | a stylized handshake or briefcase outline |

---

## Full count

| Category | Total pages | Have real photo | Need generation |
|---|---|---|---|
| Industry pages | 21 | **21** ✅ | 0 |
| City pages | 15 | 7 | 8 |
| State pages | 20 | 0 | 20 |
| Service pages | 11 | 0 | 11 |
| Article pages | 3 | 1 | 2 |
| Case study covers | 7 | 1 | 6 |
| **Total** | **77** | **31** | **46** |

## Quality checklist

- Landscape orientation, roughly matching the target ratio noted per section.
- No visible text, logos, or watermarks baked into the image — regenerate if ChatGPT adds garbled text.
- No identifiable real person, brand, or trademark — generic/stock-style only.
- Alt text: I write this when I wire the file in — you don't need to supply it.
- **Filename precision matters**: one upload in this batch had a typo (`agentshowing` instead of `agent-showing`) — I caught and renamed it, but double-check filenames match exactly before uploading to save a round-trip.
