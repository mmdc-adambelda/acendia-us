# Acendia US Website — Pre-Implementation Audit

Date: 2026-08-06

## 1. Repository State (before this build)
- `acendia-us` folder was **empty** — no framework, no git repo, no existing pages.
- Decision: scaffold fresh on **Next.js (App Router) + TypeScript + Tailwind CSS**, chosen for SSG/SSR metadata control, file-based routing that scales to hundreds of state/city/industry pages, and easy Vercel deployment.

## 2. Brand Sources Reviewed (for identity only, not content)
Visited `https://acendia.agency` (NZ, WordPress/Bricks theme) and `https://acendia.uk` (UK/AU, custom-coded — this is the current/active identity system). No page copy, headings, FAQs, or layouts were copied from either site.

Extracted for reuse:
- **Logo**: white "Acendia" wordmark with ascending chevron mark → saved to `public/brand/acendia-logo.png`
- **Favicon**: saved to `public/brand/acendia-favicon.png`
- **Color system** (from acendia.uk `:root`): near-black base (`#000000`/`#0A0A0A`), card surface `#111111`, gray scale `#2A2A2A → #F4F4F4`, white primary text, translucent white borders (`rgba(255,255,255,.06/.12/.28)`), soft white/black glows for depth.
- **Typography**: Inter (system-ui fallback stack).
- **Radii scale**: 8 / 14 / 24 / 40px.
- **Tagline**: "YOUR Business, OUR Business" (approved, reused verbatim as instructed).

Nothing else — no paragraphs, headings, service descriptions, testimonials, FAQs, or metadata — was carried over from either domain.

## 3. What Stays Consistent Across All Acendia Sites
- Logo, favicon, company name, tagline
- Core black/white/gray premium visual language and Inter typeface
- Core service categories (SEO, local SEO, web design/dev, content, lead gen)

## 4. What Is Built From Scratch for acendia.us
- All page copy, headings, hero messaging, FAQs, examples, and CTAs
- US-specific information architecture: `/locations/[state]/[city]/`, `/industries/`, `/services/*`
- US business examples, city/state references, USD pricing language, US phone formatting
- Original component build: bento service grid, animated visibility/map hero concept, industry cards, testimonial/case-study placeholder pattern, FAQ accordion — all custom-coded against the acendia.uk token system, not copy-pasted from any external library or the sister sites
- New metadata/schema utility built specifically for this repo (self-referencing canonical, OG/Twitter tags, JSON-LD)

## 5. Duplicate-Content Avoidance
- No paragraph, heading sequence, FAQ set, or metadata string is reused from acendia.agency or acendia.uk.
- Every page targets a distinct US search intent (national commercial, local-service, city-level, industry-level) not present on the sister sites, which are NZ/UK/AU-focused.
- Canonicals are absolute, self-referencing, and point only to `https://acendia.us` — no cross-domain canonicalization.
- A duplicate-content comparison pass is run near the end of the build (Task: "Duplicate-content comparison + final deliverables report") extracting visible text from the two sister sites and diffing against US copy, excluding brand terms, service names, and the tagline.
- Location pages are written from unique local-market angles (not find-and-replace city-name templates) per the project brief.

## 6. US Differentiation Strategy
- Positioning: "AI-native digital growth agency" framed for US buyers — SEO + local SEO + GBP + AI search visibility + conversion-focused web builds, aimed at industries capable of recurring retainers (home services, legal, healthcare, real estate, moving/logistics, automotive, professional/B2B).
- IA scoped for **phased** state/city/industry expansion rather than a flat, one-shot template dump — start with a small proven set of pages, expand once each is genuinely unique and useful.
- No fabricated testimonials, results, awards, certifications, or office addresses. Placeholders are clearly labeled where real business info (client logos, case studies, verified stats) is not yet available.
- Contact info: per your direction, no phone/email is hardcoded in the footer/schema — visitors are routed to a `/contact/` page with a form; ContactPoint schema is omitted until real details exist.

## 7. Scope for This Build Pass (agreed with you)
"Core skeleton first": design system, homepage, ~10–12 core service pages, locations + industries hubs with reusable templates and a small proof set of priority pages (Texas / Houston / Austin; Home Services / Roofing SEO / Law Firm SEO), metadata/schema/sitemap infrastructure, forms with tracking hooks. Full 8-state/15-city/7-industry rollout is a follow-up pass once you've reviewed this foundation.
