# Image Inventory — What's Missing, Filenames, and ChatGPT Prompts

Generated: 2026-08-06

## Where images already exist

| File | Used on |
|---|---|
| `public/brand/acendia-logo.png` | Header, footer, favicon fallback |
| `public/brand/acendia-favicon.png` | Browser tab icon |
| `public/images/us-home-services-team-onsite.webp` | `/industries/home-services/` |
| `public/images/houston-tx-skyline.webp` | `/locations/texas/houston/` |
| `public/images/austin-tx-skyline.webp` | `/locations/texas/austin/` |
| `public/images/healthcare-case-study-cover.webp` | `/case-studies/` (Healthcare card) |

## Where to save new files

Save everything to **`public/images/`** (flat, no subfolders — matches the 4 files already there). Use the exact filenames below — lowercase, hyphenated, descriptive, no `image1.jpg`-style names. Once a file is in that folder, tell me and I'll wire it into the page (one line of code each) — for `/industries/*` and `/locations/*/*` pages the slot already exists in the code; for state, service, and article pages I'd need to add the image slot first (noted below).

## How to generate with ChatGPT

1. Go to ChatGPT (with image generation / DALL·E 3).
2. Paste the prompt from the tables below.
3. Ask for **landscape / widescreen** orientation (ChatGPT doesn't take exact pixel dimensions — I'll resize whatever you download to the exact spec automatically).
4. Download the PNG, drop it in `public/images/` with the exact filename listed, and let me know — I'll resize, convert to WebP, and wire it in.

**Style prefix to prepend to every prompt** (keeps everything visually consistent):
> "Photorealistic, high-end commercial stock photography style, natural lighting, sharp focus, no visible logos, no text overlays, no watermarks —"

---

## 1. Industry pages missing a hero image (20 of 21)

Slot already wired in code (`heroImage` field in `lib/industryContent.ts`) — just needs the file + I add one line per page. Target size: **1600×1000**.

| Page | Filename | ChatGPT prompt (append to style prefix above) |
|---|---|---|
| `/industries/law-firm-seo/` | `us-law-firm-consultation-room.webp` | "a modern US law firm consultation room, polished wood conference table, leather chairs, large window overlooking a city skyline, warm natural light, an attorney in a suit discussing documents with a client at a respectful mid-distance" |
| `/industries/healthcare/` | `us-medical-practice-exam-room.webp` | "a bright, modern US medical practice exam room, clean and reassuring, a doctor in a white coat reviewing a tablet, warm natural light through a window" |
| `/industries/real-estate/` | `us-real-estate-agent-showing-home.webp` | "a real estate agent in business casual attire showing a modern US suburban home's front entrance to a couple, sunny afternoon, For Sale sign softly visible in the background" |
| `/industries/moving-and-logistics/` | `us-moving-company-loading-truck.webp` | "professional movers in matching uniforms loading boxes into a branded-but-unmarked moving truck outside a US suburban home, daytime, organized and efficient" |
| `/industries/automotive/` | `us-auto-repair-shop-technician.webp` | "an auto repair technician in coveralls working under the hood of a car in a clean, well-lit US auto repair shop bay" |
| `/industries/professional-services/` | `us-professional-services-office-meeting.webp` | "a small team meeting in a modern US professional services office, laptops open, whiteboard with light diagrams, natural daylight, business casual attire" |
| `/industries/roofing-seo/` | `us-roofing-contractor-on-roof.webp` | "a roofing contractor in safety gear installing shingles on a residential US roof, clear sunny sky, ladder visible" |
| `/industries/hvac-seo/` | `us-hvac-technician-indoor-unit.webp` | "an HVAC technician servicing an indoor air handler unit in a US home utility closet, work light, focused expression" |
| `/industries/plumbing-seo/` | `us-plumber-under-sink-repair.webp` | "a plumber in a branded-but-unmarked uniform repairing pipes under a kitchen sink in a US home, tools laid out neatly" |
| `/industries/electrician-seo/` | `us-electrician-panel-upgrade.webp` | "an electrician working on an open electrical panel in a US home, safety glasses, multimeter in hand, focused" |
| `/industries/restoration-company-seo/` | `us-water-damage-restoration-crew.webp` | "a water damage restoration crew in protective gear running industrial drying equipment in a US home living room" |
| `/industries/personal-injury-lawyer-seo/` | `us-personal-injury-attorney-office.webp` | "a personal injury attorney reviewing case files at a desk in a professional US law office, confident and approachable" |
| `/industries/family-law-seo/` | `us-family-law-attorney-meeting.webp` | "a calm, warm consultation between a family law attorney and a client in a softly lit US law office, non-adversarial and reassuring tone" |
| `/industries/dental-seo/` | `us-dental-practice-checkup.webp` | "a friendly dentist and assistant in a bright, modern US dental practice treatment room, patient chair visible, clean and welcoming" |
| `/industries/med-spa-seo/` | `us-med-spa-treatment-room.webp` | "an elegant, premium US med spa treatment room, soft lighting, clean modern decor, minimalist and calming" |
| `/industries/property-management-seo/` | `us-property-manager-inspection.webp` | "a property manager with a clipboard/tablet inspecting a well-maintained US apartment building exterior, professional attire" |
| `/industries/moving-company-seo/` | `us-movers-carrying-furniture.webp` | "two professional movers carefully carrying a sofa into a moving truck outside a US home, teamwork, daytime" |
| `/industries/auto-repair-seo/` | `us-auto-repair-brake-service.webp` | "a mechanic servicing a car's brakes on a lift in a clean, organized US auto repair shop" |
| `/industries/accounting-firm-seo/` | `us-accounting-firm-consultation.webp` | "an accountant reviewing financial documents with a small business owner client in a modern US accounting firm office" |
| `/industries/managed-it-seo/` | `us-managed-it-server-room.webp` | "an IT professional working on a laptop in a clean, modern server room / data closet, blue-toned ambient lighting, professional and secure feeling" |

## 2. City pages missing a skyline image (11 of 13)

Slot already wired (`heroImage` field in `lib/locationContent.ts`) — same as above. Target size: **1600×900**.

| Page | Filename | ChatGPT prompt |
|---|---|---|
| `/locations/texas/dallas/` | `dallas-tx-skyline.webp` | "wide cityscape of downtown Dallas, Texas skyline at golden hour, modern skyscrapers including a distinctive tower silhouette, clear sky, no people, no text" |
| `/locations/florida/miami/` | `miami-fl-skyline.webp` | "wide cityscape of downtown Miami, Florida skyline at dusk, colorful sunset over Biscayne Bay, modern high-rises, no people, no text" |
| `/locations/florida/tampa/` | `tampa-fl-skyline.webp` | "wide cityscape of downtown Tampa, Florida skyline along the riverwalk at golden hour, no people, no text" |
| `/locations/florida/orlando/` | `orlando-fl-skyline.webp` | "wide cityscape of downtown Orlando, Florida skyline reflected in a lake at dusk, no people, no text" |
| `/locations/california/los-angeles/` | `los-angeles-ca-skyline.webp` | "wide cityscape of downtown Los Angeles skyline at golden hour with palm trees in the foreground, no people, no text" |
| `/locations/california/san-diego/` | `san-diego-ca-skyline.webp` | "wide cityscape of downtown San Diego skyline with the bay and boats in the foreground at sunset, no people, no text" |
| `/locations/new-york/new-york-city/` | `new-york-city-ny-skyline.webp` | "wide cityscape of the Manhattan skyline at dusk with city lights turning on, no people, no text" |
| `/locations/georgia/atlanta/` | `atlanta-ga-skyline.webp` | "wide cityscape of downtown Atlanta, Georgia skyline at golden hour, modern skyscrapers, no people, no text" |
| `/locations/north-carolina/charlotte/` | `charlotte-nc-skyline.webp` | "wide cityscape of downtown Charlotte, North Carolina skyline at dusk, no people, no text" |
| `/locations/north-carolina/raleigh/` | `raleigh-nc-skyline.webp` | "wide cityscape of downtown Raleigh, North Carolina skyline at golden hour, no people, no text" |
| `/locations/arizona/phoenix/` | `phoenix-az-skyline.webp` | "wide cityscape of downtown Phoenix, Arizona skyline at sunset with desert mountains in the background, no people, no text" |
| `/locations/arizona/scottsdale/` | `scottsdale-az-skyline.webp` | "wide upscale desert cityscape of Scottsdale, Arizona at golden hour, palm-lined streets and modern low-rise architecture, desert mountains in background, no people, no text" |
| `/locations/illinois/chicago/` | `chicago-il-skyline.webp` | "wide cityscape of the Chicago skyline from the lakefront at golden hour, no people, no text" |

## 3. Case study cover art missing (6 of 7)

Slot already wired (`COVER_IMAGES` map in `app/case-studies/page.tsx`) — same pattern as the Healthcare one already live. Target size: **1200×800**. These are **abstract, not photos** — keep them that way so nothing implies a real case study exists yet.

**Style prefix for these** (different from the one above): *"Abstract minimalist premium brand cover art, pure black background, subtle thin white glowing geometric line-art outline, clean modern monochrome design, no text, no people, no logos —"*

| Page card | Filename | Subject |
|---|---|---|
| Home Services | `home-services-case-study-cover.webp` | "a stylized house and roof silhouette outline" |
| Legal | `legal-case-study-cover.webp` | "stylized scales of justice" |
| Real Estate & Property | `real-estate-case-study-cover.webp` | "a stylized building/skyline silhouette outline" |
| Moving & Logistics | `moving-logistics-case-study-cover.webp` | "a stylized moving truck or shipping box outline" |
| Automotive Services | `automotive-case-study-cover.webp` | "a stylized car silhouette outline" |
| Professional & B2B Services | `professional-services-case-study-cover.webp` | "a stylized handshake or briefcase outline" |

---

## 4. Pages that don't have an image slot yet (need a small code change first)

These weren't part of the original image plan, so the templates don't currently render an image at all. I can add the slot in a few minutes if you want visuals here too — just say so.

- **State pages** (20 of 20 — `/locations/texas/`, `/locations/florida/`, etc.) — no `heroImage` field exists on `StateContent` yet.
- **Service pages** (11 of 11 — `/services/seo/`, `/services/local-seo/`, etc.) — currently icon-driven by design (bento grid), no photo slot.
- **Articles** (3 of 3 — all `/insights/*` posts) — no featured-image field on `Article` type; would also improve social-share (OG image) previews.

If you want these too, tell me and I'll (a) add the code slot, then (b) give you the filenames/prompts in the same format as above.

---

## Quality checklist for whatever you generate

- **Landscape orientation**, roughly matching the target ratio (industries/services: 8:5, cities: 16:9, case covers: 3:2) — I'll crop precisely on my end regardless.
- **No visible text, logos, or watermarks** baked into the image — ChatGPT sometimes adds garbled text; regenerate if so.
- **No identifiable real person, brand, or trademark** — keep it generic/stock-style.
- **Alt text**: I'll write descriptive alt text matching each page's context when I wire the file in (already done for the 4 live images) — you don't need to do this part.
