# Acendia Owner Action Required — Consolidated List

All 5 phases (Foundation, Payments, Client Portal, Admin Portal, Comms/Testing) are **code-complete and pushed**. Nothing further needs to be built for the system to work end-to-end — everything below is credentials, accounts, and one-time configuration only you can provide. Full step-by-step detail for every item is in `CLIENT-PORTAL-SETUP.md`; this is the prioritized checklist.

---

## ✅ What's built (all 5 phases)

- **Foundation**: Supabase auth, full database schema + Row Level Security, real pricing ($199 setup + $499/mo Growth Package, $299/mo Social Media add-on), 5-step registration wizard, login/password reset/email verification, public `/pricing/`.
- **Phase 2 — Payments**: Stripe Checkout + Billing Portal + webhooks, PayPal Subscriptions + webhooks, Wise manual payment-link + admin-confirmation flow, real `/checkout` with provider selection, server-side-only pricing (never trusts the browser).
- **Phase 3 — Client Portal** (`/portal/*`): dashboard, campaign, SEO performance, tasks, reports, files, messages, billing, support, settings.
- **Phase 4 — Admin Portal** (`/admin/*`): dashboard (MRR, active clients, past-due, open tickets), client list/detail, manual client creation, projects, tasks, reports (publish workflow), **payments (Wise confirmation queue)**, subscriptions (manual override), messages, plans, full activity log.
- **Phase 5 — Comms & Testing**: transactional email via Resend (gated, degrades silently if not configured), in-app notification bell, 15 automated unit tests (`npm test`) covering payment-config gating, Wise reference generation, and registration validation.
- Every authenticated route stays `noindex, nofollow` and out of the sitemap; nothing about the existing marketing site's URLs, content, or SEO was touched.

---

## 🔴 Required for the portal to work at all

### 1. Get your Supabase API keys
- **Where**: [supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API**
- **Copy**: anon/public key → `.env.local` + Vercel `NEXT_PUBLIC_SUPABASE_ANON_KEY`; service_role key (**secret**) → `.env.local` + Vercel `SUPABASE_SERVICE_ROLE_KEY`
- **Test**: `/register/` → step 1 should send a confirmation email and create a `profiles` row.

### 2. Run the database migrations, in order
- **Where**: Supabase Dashboard → **SQL Editor**
- **Run**: `0001_schema.sql` → `0002_rls_policies.sql` → `0003_seed_plans.sql` → `0004_seed_onboarding_items.sql`
- **Test**: Table Editor shows a `plans` table with 2 rows.

### 3. Configure Supabase auth redirect URLs
- **Where**: Supabase Dashboard → **Authentication** → **URL Configuration**
- **Do**: set Site URL to your production URL; add `http://localhost:3000/**`, your Vercel URL, and `https://acendia.us/**` to Redirect URLs.

### 4. Create the private `client-files` Storage bucket
- **Where**: Supabase Dashboard → **Storage** → Create bucket named exactly `client-files`, **private** (not public).
- **Why**: `/portal/files` serves everything through short-lived signed URLs — no bucket, no file downloads.

### 5. Add all env vars to Vercel (Production + Preview)
- The three Supabase vars above, plus `NEXT_PUBLIC_APP_URL`. See `.env.example` for the full documented list.

---

## 🟡 Required to accept real payments

### 6. Create your Stripe account and connect it
- Create products/prices ($499/mo Growth Package, $299/mo Social Media) in **Test mode** first.
- Copy the recurring Price IDs into `supabase/migrations/0005_payment_provider_ids_template.sql` (fill in, then run in SQL Editor) — **not** an env var, so pricing always comes from the database.
- Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to Vercel.
- Add a webhook endpoint at `https://acendia.us/api/webhooks/stripe` (events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`); copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
- Configure the Stripe Customer Portal (branding) — this powers "Manage Billing" in `/portal/billing`.
- Full detail: `CLIENT-PORTAL-SETUP.md` Part 2.

### 7. Create your PayPal Business account and app
- Create a Product/Plan matching the same pricing; copy the Plan ID into the same `0005_...sql` template file.
- Add `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENVIRONMENT=sandbox` (then `live` when ready) to Vercel.
- Add a webhook at `https://acendia.us/api/webhooks/paypal`; copy the Webhook ID into `PAYPAL_WEBHOOK_ID`.
- Full detail: `CLIENT-PORTAL-SETUP.md` Part 3.

### 8. Decide on Wise
- Wise payments are **manual by design** — your team confirms each transfer in `/admin/payments`, nothing auto-activates. This matches the brief's explicit requirement that Wise never be presented as equivalent to instant billing.
- If you want Wise offered at checkout at all, set `WISE_PAYMENT_LINK` (a real payment link, if your Wise account supports one) in Vercel. If you'd rather not offer Wise yet, skip this — it simply won't appear as a checkout option.
- Full detail: `CLIENT-PORTAL-SETUP.md` Part 4.

---

## 🟢 Recommended, not blocking

### 9. Connect the `acendia.us` domain to Vercel
Vercel → project → **Settings** → **Domains** → add `acendia.us`, follow DNS instructions. Update `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs to match once connected.

### 10. Set up transactional email (Resend)
Without this, payment confirmations, new-message, and new-report emails are silently skipped (logged only) — the app still works, clients just won't get emailed. Create a Resend account, verify your sending domain, add `RESEND_API_KEY`, `EMAIL_FROM`, and `ADMIN_NOTIFICATION_EMAIL` (the inbox that gets new-signup/new-message/new-ticket alerts) to Vercel. Full detail: `CLIENT-PORTAL-SETUP.md` Part 5.

### 11. Assign your first staff/admin users
New accounts default to the `client` role. To make someone `staff`/`admin`/`super_admin` (so they can reach `/admin`), update their `profiles.role` directly in Supabase's Table Editor — there's no self-service way to grant this, intentionally.

### 12. Have a licensed attorney review Privacy Policy and Terms
`/privacy-policy/` and `/terms/` were updated for accounts/payments and are flagged in-page for your review — not a substitute for legal counsel, especially before real payments go live.

### 13. Run the manual QA checklist once credentials exist
`CLIENT-PORTAL-IMPLEMENTATION.md` §13 has an 8-step checklist (registration → verification → login, org isolation, Stripe/PayPal/Wise activation, failed payment, cancellation, admin access control) to run once Stripe/PayPal sandbox credentials are wired up — these flows can't be tested from this environment since no live provider credentials exist here.

---

## What happens once you complete the 🔴 items (1-5)
Registration, login, the full client portal, and the full admin portal are live and functional with real data — clients just can't pay online yet (checkout shows a "contact us" fallback if no payment provider is configured).

## What happens once you also complete the 🟡 items (6-8)
Real online checkout works end-to-end: Stripe/PayPal activate automatically via verified webhooks, Wise activates when your team confirms a transfer in `/admin/payments`.

## What the 🟢 items add
Custom domain, email notifications, and legal review — polish and completeness, not blocking functionality.
