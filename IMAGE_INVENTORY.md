# Image Inventory — What's Missing, Filenames, and ChatGPT Prompts

Updated: 2026-08-06 (v2 — every page now has a visual, real photo or placeholder)

## What changed in this pass

Every page listed below **already renders correctly today** — nothing is broken or blank. Pages without a real photo now show a code-generated placeholder (a subtle icon on the site's black/grid background, no AI credits used, no "coming soon" text visible to visitors). Swapping in a real photo later is a one-line code change per page once the file exists — no layout work needed.

## Where images already exist (real photos, no action needed)

| File | Used on |
|---|---|
| `public/brand/acendia-logo.png` / `acendia-favicon.png` | Header, footer, favicon |
| `public/images/us-home-services-team-onsite.png` | `/industries/home-services/` |
| `public/images/houston-tx-skyline.png` | `/locations/texas/houston/` |
| `public/images/austin-tx-skyline.png` | `/locations/texas/austin/` |
| `public/images/healthcare-case-study-cover.png` | `/case-studies/` (Healthcare card) |

## Where to save new files

Save everything to **`public/images/`** (flat folder, no subfolders). Use the exact filenames below. Once a file is there, tell me — I resize to spec (staying PNG) and wire it in.

## How to generate with ChatGPT

1. Paste the prompt from the tables below into ChatGPT (with image generation).
2. Ask for **landscape / widescreen** orientation — exact pixel dimensions aren't critical, I crop precisely on my end.
3. Download the PNG, save to `public/images/` with the exact filename, tell me it's ready.

**Style prefix for all photo prompts** (prepend to every one below unless noted otherwise):
> "Photorealistic, high-end commercial stock photography style, natural lighting, sharp focus, no visible logos, no text overlays, no watermarks —"

**Style prefix for abstract cover art** (case study covers only):
> "Abstract minimalist premium brand cover art, pure black background, subtle thin white glowing geometric line-art outline, clean modern monochrome design, no text, no people, no logos —"

---

## 1. Industry pages — 20 of 21 missing (1600×1000)

| Page | Filename | Prompt subject |
|---|---|---|
| `/industries/law-firm-seo/` | `us-law-firm-consultation-room.png` | a modern US law firm consultation room, polished wood conference table, leather chairs, large window overlooking a city skyline, warm natural light, an attorney in a suit discussing documents with a client at respectful mid-distance |
| `/industries/healthcare/` | `us-medical-practice-exam-room.png` | a bright, modern US medical practice exam room, a doctor in a white coat reviewing a tablet, warm natural light |
| `/industries/real-estate/` | `us-real-estate-agent-showing-home.png` | a real estate agent showing a modern US suburban home's entrance to a couple, sunny afternoon, For Sale sign softly visible |
| `/industries/moving-and-logistics/` | `us-moving-company-loading-truck.png` | professional movers in matching uniforms loading boxes into an unmarked moving truck outside a US suburban home, daytime |
| `/industries/automotive/` | `us-auto-repair-shop-technician.png` | an auto repair technician working under the hood of a car in a clean, well-lit US auto repair shop bay |
| `/industries/professional-services/` | `us-professional-services-office-meeting.png` | a small team meeting in a modern US professional services office, laptops open, natural daylight |
| `/industries/roofing-seo/` | `us-roofing-contractor-on-roof.png` | a roofing contractor in safety gear installing shingles on a residential US roof, clear sunny sky |
| `/industries/hvac-seo/` | `us-hvac-technician-indoor-unit.png` | an HVAC technician servicing an indoor air handler in a US home utility closet |
| `/industries/plumbing-seo/` | `us-plumber-under-sink-repair.png` | a plumber repairing pipes under a kitchen sink in a US home, tools laid out neatly |
| `/industries/electrician-seo/` | `us-electrician-panel-upgrade.png` | an electrician working on an open electrical panel in a US home, safety glasses, multimeter in hand |
| `/industries/restoration-company-seo/` | `us-water-damage-restoration-crew.png` | a water damage restoration crew in protective gear running industrial drying equipment in a US home living room |
| `/industries/personal-injury-lawyer-seo/` | `us-personal-injury-attorney-office.png` | a personal injury attorney reviewing case files at a desk in a professional US law office |
| `/industries/family-law-seo/` | `us-family-law-attorney-meeting.png` | a calm, warm consultation between a family law attorney and a client in a softly lit US law office |
| `/industries/dental-seo/` | `us-dental-practice-checkup.png` | a friendly dentist and assistant in a bright, modern US dental treatment room |
| `/industries/med-spa-seo/` | `us-med-spa-treatment-room.png` | an elegant, premium US med spa treatment room, soft lighting, minimalist decor |
| `/industries/property-management-seo/` | `us-property-manager-inspection.png` | a property manager with a tablet inspecting a well-maintained US apartment building exterior |
| `/industries/moving-company-seo/` | `us-movers-carrying-furniture.png` | two professional movers carefully carrying a sofa into a moving truck outside a US home |
| `/industries/auto-repair-seo/` | `us-auto-repair-brake-service.png` | a mechanic servicing a car's brakes on a lift in a clean, organized US auto repair shop |
| `/industries/accounting-firm-seo/` | `us-accounting-firm-consultation.png` | an accountant reviewing financial documents with a small business owner client in a modern US office |
| `/industries/managed-it-seo/` | `us-managed-it-server-room.png` | an IT professional working on a laptop in a clean, modern server room, blue-toned ambient lighting |

## 2. City pages — 11 of 13 missing (1600×900)

| Page | Filename | Prompt subject |
|---|---|---|
| `/locations/texas/dallas/` | `dallas-tx-skyline.png` | downtown Dallas, Texas skyline at golden hour, distinctive tower silhouette, clear sky |
| `/locations/florida/miami/` | `miami-fl-skyline.png` | downtown Miami, Florida skyline at dusk, colorful sunset over Biscayne Bay |
| `/locations/florida/tampa/` | `tampa-fl-skyline.png` | downtown Tampa, Florida skyline along the riverwalk at golden hour |
| `/locations/florida/orlando/` | `orlando-fl-skyline.png` | downtown Orlando, Florida skyline reflected in a lake at dusk |
| `/locations/california/los-angeles/` | `los-angeles-ca-skyline.png` | downtown Los Angeles skyline at golden hour, palm trees in the foreground |
| `/locations/california/san-diego/` | `san-diego-ca-skyline.png` | downtown San Diego skyline with the bay and boats in the foreground at sunset |
| `/locations/new-york/new-york-city/` | `new-york-city-ny-skyline.png` | the Manhattan skyline at dusk with city lights turning on |
| `/locations/georgia/atlanta/` | `atlanta-ga-skyline.png` | downtown Atlanta, Georgia skyline at golden hour |
| `/locations/north-carolina/charlotte/` | `charlotte-nc-skyline.png` | downtown Charlotte, North Carolina skyline at dusk |
| `/locations/north-carolina/raleigh/` | `raleigh-nc-skyline.png` | downtown Raleigh, North Carolina skyline at golden hour |
| `/locations/arizona/phoenix/` | `phoenix-az-skyline.png` | downtown Phoenix, Arizona skyline at sunset with desert mountains behind |
| `/locations/arizona/scottsdale/` | `scottsdale-az-skyline.png` | upscale desert cityscape of Scottsdale, Arizona at golden hour, palm-lined streets, desert mountains behind |
| `/locations/illinois/chicago/` | `chicago-il-skyline.png` | the Chicago skyline from the lakefront at golden hour |

All: append "no people, no text" to the end of the prompt.

## 3. State pages — 20 of 20 missing (1600×900) — NEW slot added this pass

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

## 4. Service pages — 11 of 11 missing (1600×1000) — NEW slot added this pass

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

## 5. Article featured images — 3 of 3 missing (1600×900) — NEW slot added this pass

| Page | Filename | Prompt subject |
|---|---|---|
| `/insights/local-seo-checklist-for-us-small-businesses/` | `local-seo-checklist-featured.png` | a small business owner checking a local search results page on a tablet in their storefront, warm natural light |
| `/insights/google-business-profile-optimization-mistakes/` | `gbp-mistakes-featured.png` | a close-up of a Google Business Profile-style listing card concept displayed on a laptop screen, blurred coffee shop background |
| `/insights/technical-seo-audit-checklist/` | `technical-seo-checklist-featured.png` | a developer's dual-monitor setup showing website performance charts and code, dark-mode editor, focused workspace |

## 6. Case study covers — 6 of 7 missing (1200×800, abstract not photos)

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
| Industry pages | 21 | 1 | 20 |
| City pages | 13 | 2 | 11 |
| State pages | 20 | 0 | 20 |
| Service pages | 11 | 0 | 11 |
| Article pages | 3 | 0 | 3 |
| Case study covers | 7 | 1 | 6 |
| **Total** | **75** | **4** | **71** |

You don't need to do all 71 at once — every page already looks intentional with its placeholder. Prioritize whichever pages you expect the most traffic on first (likely the 8 SEO-brief service pages and your priority-state cities).

## Quality checklist

- Landscape orientation, roughly matching the target ratio noted per section.
- No visible text, logos, or watermarks baked into the image — regenerate if ChatGPT adds garbled text.
- No identifiable real person, brand, or trademark — generic/stock-style only.
- Alt text: I write this when I wire the file in — you don't need to supply it.
