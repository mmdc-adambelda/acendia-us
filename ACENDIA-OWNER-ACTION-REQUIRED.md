# Acendia Owner Action Required

Two lists: what's already done, and exactly what you need to do next — where to go, what to click, what value to copy, and where it goes.

---

## ✅ COMPLETED BY CLAUDE (Foundation phase)

- `CLIENT-PORTAL-IMPLEMENTATION.md` — full architecture plan
- Supabase client/server/admin wiring (`lib/supabase/`)
- `proxy.ts` — session handling, `/portal` + `/admin` + `/onboarding` route protection, noindex headers
- Full database schema — 20+ tables, enums, triggers (`supabase/migrations/0001_schema.sql`)
- Row Level Security policies on every table (`supabase/migrations/0002_rls_policies.sql`)
- Real pricing seeded (`supabase/migrations/0003_seed_plans.sql`): Growth Package ($199 setup + $499/mo), Social Media Management add-on ($299/mo)
- Default onboarding checklist seeded (`supabase/migrations/0004_seed_onboarding_items.sql`)
- `/pricing/` — public, indexable, pulls real plan data
- `/register/` — 5-step wizard (Account → Business → Website & Marketing → Goals → Plan), creates a real Supabase Auth user + organization + website
- `/login/`, `/forgot-password/`, `/reset-password/`, `/verify-email/`, `/get-started/`
- `/checkout/`, `/checkout/success/`, `/checkout/cancel/`, `/onboarding/`, `/portal/`, `/admin/` — real, auth/role-gated stub pages (Phase 2-4 build out the full functionality)
- All new authenticated/auth routes: `noindex, nofollow` + excluded from `robots.txt` and `sitemap.xml`
- Privacy Policy and Terms of Service updated for accounts/portal/payments (flagged for your attorney's review)
- `.env.example` — full documented variable list
- `.env.local` — pre-filled with your Supabase project URL (not a secret), keys left blank for you
- Found and fixed a critical bug during testing: the new route-protection code was crashing the **entire site**, including existing marketing pages, whenever Supabase wasn't configured — fixed and verified the homepage/pricing/register all render correctly with or without Supabase configured

**Not touched**: any existing marketing page content, URLs, metadata, sitemap entries, or SEO work from earlier passes.

---

## 🔴 ACTION REQUIRED FROM ACENDIA

### 1. Get your Supabase API keys — REQUIRED for the portal to work at all

- **Where to go**: [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Project Settings** (gear icon) → **API**
- **What to copy**: the **anon / public** key and the **service_role** key (both long strings starting with `eyJ`)
- **Where it goes**:
  - anon key → `.env.local`'s `NEXT_PUBLIC_SUPABASE_ANON_KEY` (locally) **and** Vercel's `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production + Preview)
  - service_role key → `.env.local`'s `SUPABASE_SERVICE_ROLE_KEY` **and** Vercel's `SUPABASE_SERVICE_ROLE_KEY` (Production + Preview)
- **Is it secret?** anon key: no, safe to expose. service_role key: **yes, extremely** — treat it like a database master password.
- **Belongs in Vercel?** Yes, both.
- **Can it be committed to GitHub?** No — never. `.env.local` is already gitignored.
- **How to test**: after adding both keys (locally and in Vercel, then redeploying), visit `/register/` and submit Step 1 — you should receive a confirmation email and see rows appear in Supabase's Table Editor under `profiles`.

### 2. Run the 4 database migration files — REQUIRED

- **Where to go**: Supabase Dashboard → **SQL Editor** → **New query**
- **What to do**: copy/paste and run each file in `supabase/migrations/` in order: `0001_schema.sql`, `0002_rls_policies.sql`, `0003_seed_plans.sql`, `0004_seed_onboarding_items.sql`
- **Is it secret?** No.
- **Belongs in Vercel?** No — this runs directly in Supabase, not in your app deployment.
- **How to test**: Table Editor should show a `plans` table with 2 rows after running.

### 3. Configure Supabase auth redirect URLs — REQUIRED

- **Where to go**: Supabase Dashboard → **Authentication** → **URL Configuration**
- **What to do**: set Site URL to your production URL; add `http://localhost:3000/**`, `https://acendia-us.vercel.app/**`, and (once connected) `https://acendia.us/**` to Redirect URLs
- **Is it secret?** No.
- **How to test**: password reset and email confirmation links should land on the correct domain instead of erroring.

### 4. Connect the `acendia.us` domain to Vercel — recommended, not blocking

- **Where to go**: Vercel → `acendia-us` project → **Settings** → **Domains**
- **What to do**: add `acendia.us`, follow the DNS instructions shown
- **Is it secret?** No.
- **How to test**: `acendia.us` loads the site over HTTPS.

### 5. Stripe, PayPal, Wise, Resend accounts — not needed yet (Phase 2/5)

Full step-by-step instructions are in `CLIENT-PORTAL-SETUP.md` Parts 2-5. **Nothing to do here right now** — checkout is intentionally stubbed until those integrations are built. When you're ready to move to Phase 2, let us know and we'll build the real checkout flow against whichever of these you've set up.

### 6. Have a licensed attorney review the updated Privacy Policy and Terms

- **Where**: `/privacy-policy/` and `/terms/` on the live site (both flagged in-page with a visible note for you)
- **Why**: these were updated in good faith to reflect accounts/portal/payments but are not a substitute for legal review, especially before real payments go live.

---

## What happens once you complete items 1-3 above

Registration, login, password reset, and the pricing page will be **fully live and functional** — real accounts, real database records, real email verification. Checkout itself stays a "we'll follow up" stub until Phase 2. Nothing else needs to happen for the Foundation phase to be considered complete and working.
