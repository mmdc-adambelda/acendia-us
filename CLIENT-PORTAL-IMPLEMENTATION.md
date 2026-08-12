# Acendia US — Client Portal, Subscription & Payment System
## Implementation Plan

Date: 2026-08-11 · Status: Foundation phase in progress (see phase breakdown at the end)

---

## 1. Existing Architecture (audit)

| Area | Finding |
|---|---|
| Framework | Next.js 16.3.0, App Router, TypeScript |
| React | 19.2.8 |
| Styling | Tailwind CSS v4, no component library — hand-built design system (`app/globals.css` design tokens, `components/*`) |
| Routing | File-based App Router, flat `app/` directory (`about`, `services`, `locations`, `industries`, `insights`, `case-studies`, `contact`, `free-seo-audit`, `campaigns`, `privacy-policy`, `terms`) plus dynamic segments (`services/[slug]`, `locations/[state]/[city]`, `industries/[slug]`, `campaigns/[slug]`) |
| Database | **None** — fully static/SSG marketing site, no backend data layer |
| Auth | **None** |
| Supabase | **Not installed.** Owner has an existing Supabase project (`https://eqedvioirmitcwtobjzk.supabase.co`) not yet wired into this repo |
| Forms | One form pattern (`components/LeadForm.tsx`) posting to `app/api/lead/route.ts` — Zod validation, honeypot spam field, in-memory rate limiter, optional CRM webhook forward via `GHL_WEBHOOK_URL` |
| Validation | Zod v4, already the project's schema library — reuse it for portal/checkout, per the "reuse what exists" instruction |
| Analytics | `components/Analytics.tsx` — env-gated GTM/GA4 loader, no IDs configured yet; `lib/analytics.ts` defines a `trackEvent()` helper and a typed event union |
| SEO | `lib/seo.ts` (`buildMetadata()` — canonical, OG, Twitter, `noIndex` flag already supported), `lib/schema.ts` (JSON-LD builders), `app/sitemap.ts` (explicit route list, not directory-scanned — new authenticated routes will **not** leak in automatically, but must still not be added there), `app/robots.ts` (currently disallows only `/api/`) |
| Middleware | **None** — no `middleware.ts` exists yet |
| Deployment | Vercel, auto-deploy from `main` on GitHub (`mmdc-adambelda/acendia-us`), live at `https://acendia-us.vercel.app` ahead of custom domain connection |
| Env vars | `.env.example` exists with analytics/CRM-webhook placeholders only (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `GHL_WEBHOOK_URL`, etc.) — no auth or payment vars |
| `next.config.ts` | Only sets `trailingSlash: true` (required for the existing canonical/sitemap convention — **must be preserved**, portal routes should follow the same trailing-slash convention for consistency, though this is a UX/consistency choice, not a hard requirement for authenticated routes) |
| Dependencies | `next`, `react`, `react-dom`, `lucide-react`, `zod` only. No ORM, no auth library, no payment SDKs |

**Conclusion**: this is a clean slate for the portal build — nothing to migrate away from, no conflicting patterns to reconcile. The existing marketing site's conventions (Zod validation, `buildMetadata()`, Tailwind design tokens, Server Components by default) carry forward directly into the portal rather than being replaced.

---

## 2. Recommended Architecture

- **Auth & DB**: Supabase (Postgres + Auth + Storage), using the owner's existing project. `@supabase/ssr` for Next.js App Router cookie-based session handling (the current standard approach, replacing the deprecated `@supabase/auth-helpers-nextjs`).
- **Validation**: Zod everywhere — already the project standard.
- **Payments**: A provider-agnostic internal abstraction (`lib/payments/`) with three provider adapters (Stripe, PayPal, Wise) implementing a shared interface. Internal records (`subscriptions`, `payments`) never encode provider-specific assumptions in their core schema — provider-specific IDs live in dedicated nullable columns.
- **Server-side authority**: All pricing, plan validity, subscription activation, and role checks are resolved server-side (Server Components, Server Actions, and Route Handlers) — never trusted from client state. This directly satisfies the brief's repeated "never trust the browser for price/payment state" requirement.
- **Two experiences, one codebase**: the existing marketing site is untouched at the routing level; new route groups add the authenticated app around it:
  - `app/(marketing)/...` — *conceptually* the existing public pages (not physically moved in this phase, to avoid unnecessary churn/URL risk; see §3 note)
  - `app/(auth)/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
  - `app/(app)/portal/...` — client-authenticated
  - `app/(app)/admin/...` — staff-authenticated
  - `app/checkout/...`, `app/onboarding/...`
- **Route protection**: `middleware.ts` refreshes the Supabase session on every request and redirects unauthenticated users away from `/portal/*` and `/admin/*`; role checks (`client`/`staff`/`admin`/`super_admin`) happen again inside each Server Component/Route Handler via RLS + an explicit role check — middleware is a UX convenience, **not** the security boundary.

### Note on route groups vs. physically moving existing pages

The brief lists `app/(marketing)/` as a possible grouping. I'm **not** physically moving the 70+ existing marketing pages into a route group this phase — Next.js route groups don't change URLs (parentheses are stripped from the path), so it's a safe, zero-URL-risk change technically, but moving ~20 directories in bulk is unnecessary churn for zero functional benefit at this stage and increases the diff size/review burden with no upside. The public site keeps its exact current file locations. If organizational clarity becomes valuable later (e.g., applying a different layout to all marketing pages at once), it's a mechanical, low-risk move to make then.

---

## 3. Database Design

Supabase Postgres, managed via SQL migrations in `supabase/migrations/`. Full schema in `supabase/migrations/0001_init.sql` (see repo). Summary:

| Table | Purpose |
|---|---|
| `profiles` | 1:1 with `auth.users`, extends with name/phone/role |
| `organizations` | The client's company/account — the tenancy boundary everything else hangs off |
| `organization_members` | User ↔ organization, with a role (`owner`/`member`) — supports multiple users per org from day one |
| `websites` | A business's website(s) — org can have many |
| `locations` | Physical/service locations per org — supports multi-location clients |
| `plans` | Admin-configurable package catalog (name, prices, provider price IDs, features, active flag) |
| `subscriptions` | One per org per active service — normalized `payment_provider`/`subscription_status`, provider IDs in separate columns |
| `payments` | Individual payment/charge records, any provider |
| `invoices` | Invoice records (Stripe-synced or manually issued for Wise) |
| `payment_webhook_events` | Every received webhook event ID stored before processing — the idempotency guard |
| `projects` / `campaigns` | The SEO/marketing engagement tied to an org + subscription |
| `campaign_services` | Which services (from `plans`/a service catalog) are active on a campaign |
| `tasks` | Work items, with a `client_visible` flag separating client-facing from internal notes |
| `milestones` | Named checkpoints on a campaign timeline |
| `reports` / `report_metrics` | Published monthly reports + structured metric rows (traffic, keywords, leads) — admin-entered until API integrations exist |
| `files` | Metadata for Supabase Storage objects, org-scoped |
| `conversations` / `messages` | Lightweight client↔staff threads |
| `support_tickets` | Client support requests with status lifecycle |
| `onboarding_items` / `onboarding_responses` | Checklist template + per-org completion state |
| `notifications` | In-app notification center rows |
| `activity_logs` | Audit trail for sensitive actions (role changes, subscription changes, admin edits) |

**Row Level Security (RLS)** is enabled on every table. Policy pattern: a user can read/write a row only if they're a member of the `organization_id` on that row (via `organization_members`), or if their `profiles.role` is `staff`/`admin`/`super_admin` (staff+ get broader read access; only `admin`/`super_admin` get write access to cross-org admin operations). This is enforced at the database level, so even a bug in application code can't leak Client A's data to Client B — satisfying the brief's "Client A must NEVER access Client B" requirement structurally, not just via UI checks.

---

## 4. Authentication Approach

**Supabase Auth**, per the brief's explicit instruction ("If Supabase is already part of this project: USE SUPABASE AUTH" — it now is, via the owner's existing project).

- Email/password signup with **required email verification** before the account is usable (Supabase's built-in confirmation email flow, template branded in the Supabase dashboard — see `CLIENT-PORTAL-SETUP.md`).
- `@supabase/ssr` for cookie-based sessions across Server Components, Server Actions, and Route Handlers.
- `middleware.ts` refreshes the session cookie on every request (Supabase's recommended pattern) and does a first-pass redirect for unauthenticated access to `/portal` and `/admin`.
- Google OAuth: **not implemented this phase** (explicitly marked optional/not launch-blocking in the brief) — the Supabase Auth UI supports adding it later as a config change plus one button, no schema change needed.
- Password reset: Supabase's native `resetPasswordForEmail` + a `/reset-password` page that exchanges the recovery token for a new password.
- A `profiles` row is auto-created via a Postgres trigger on `auth.users` insert (`handle_new_user()`), so every authenticated user always has a corresponding app-level profile with a default `role = 'client'`.

---

## 5. Payment Architecture

### Internal abstraction (`lib/payments/`)

```
lib/payments/
  types.ts          — shared PaymentProvider, PaymentStatus, SubscriptionStatus types
  provider.ts        — abstract interface every adapter implements
  stripe/            — Stripe adapter (Phase 2)
  paypal/             — PayPal adapter (Phase 2)
  wise/               — Wise adapter (Phase 2)
```

The abstraction and its types ship in this Foundation phase (so the DB schema and checkout UI can be built against a stable contract); the three provider adapters themselves — actual Stripe Checkout session creation, PayPal subscription API calls, Wise payment link generation, and all three webhook handlers — are **Phase 2**, because they require real (even sandbox) provider credentials the owner doesn't have yet. Building against fake credentials would produce code that can't actually be tested and would need rework once real sandbox accounts exist.

### Provider-specific notes (for Phase 2 planning)

- **Stripe** is the primary recurring-billing rail: Stripe Checkout for the initial purchase, Stripe Billing for recurring charges, Stripe Customer Portal for self-service billing management. Never store card data — Stripe hosts all of it.
- **PayPal**: PayPal Subscriptions API (Products → Plans → Subscriptions), separate from PayPal's older Payments API. Sandbox vs. live mode via `PAYPAL_ENVIRONMENT`.
- **Wise**: Wise Business does **not** offer merchant recurring-billing infrastructure equivalent to Stripe Billing — it's built for transfers, not subscription management. The realistic implementation is a payment-link-plus-manual-reconciliation flow (an Acendia-generated invoice with a unique reference number, an official Wise payment link, and an admin marking it paid once the transfer clears — Wise's API can help automate the *verification* step if the account has appropriate access, but the payment itself is a bank transfer, not a card-network charge). This must be labeled **"Manual Monthly Renewal / Wise Transfer"** to the client, not presented as automatic — this is a factual constraint of how Wise works, not a corner being cut.

### Real pricing (provided by owner, seeded into `plans`)

| Plan | Type | Price |
|---|---|---|
| Acendia Growth Package | Core (setup fee + recurring) | Setup fee: **$199** (one-time) · Monthly: **$499/mo** |
| Social Media Management | Add-on (optional, stacks on the core plan) | **$299/mo** |

This is the real pricing the owner provided — it's seeded directly into the `plans` table (not hardcoded in a component), so it's admin-editable later without a redeploy once `/admin/settings` (a later phase) exists. Quarterly/annual pricing fields exist in the schema but are left `null` until the owner specifies those rates — the pricing page only displays cycles that have a real, non-null price.

---

## 6. New Routes (this phase)

| Route | Status this phase |
|---|---|
| `/pricing/` | ✅ Built — real plan data |
| `/register/` | ✅ Built — multi-step wizard (Account → Business → Website & Marketing → Goals → Plan), creates the Supabase user + `organizations`/`websites` rows |
| `/login/` | ✅ Built |
| `/forgot-password/` | ✅ Built |
| `/reset-password/` | ✅ Built |
| `/verify-email/` | ✅ Built |
| `/get-started/` | ✅ Built — redirects into `/register/` (kept as a separate marketing-friendly URL per the brief's route list) |
| `/checkout/` | 🚧 Stub — "payment setup in progress" placeholder so the registration flow doesn't dead-end; real checkout is Phase 2 |
| `/checkout/success/`, `/checkout/cancel/` | 🚧 Stub, same reason |
| `/onboarding/` | 🚧 Stub |
| `/portal/*` | 🚧 Stub landing only (auth-gated, shows "portal opening soon") — full dashboard is Phase 3 |
| `/admin/*` | 🚧 Stub landing only (staff-role-gated) — full admin console is Phase 4 |

All 🚧 stub routes are real, auth-protected, `noindex`, and functional (they don't 404) — they exist so the end-to-end flow "discover → register → (stub checkout) → (stub onboarding) → (stub portal)" never breaks, satisfying "keep the application functional after each major phase," while being honest that the actual payment/portal/admin functionality lands in subsequent phases.

---

## 7. Environment Variables (this phase)

See `.env.example` for the authoritative list. This phase adds:

```
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Stripe/PayPal/Wise/Resend vars are documented in `.env.example` now (so the shape is stable and Phase 2 doesn't require another round of env-var churn) but are **not required** for this phase to function — checkout is stubbed, not live.

---

## 8. Security Considerations

- `SUPABASE_SERVICE_ROLE_KEY` is used **only** in server-only files (Route Handlers, Server Actions) — never imported into any file that ships to the client bundle. The Next.js convention (`server-only` package) is used to make this a build-time error, not just a code-review convention.
- RLS is the real security boundary, not middleware or UI checks — see §3.
- All portal/admin/checkout/auth routes carry `robots: { index: false, follow: false }` (via the existing `buildMetadata()` `noIndex` option) — see §9.
- Passwords never touch application code — Supabase Auth handles hashing/storage entirely.
- Zod validates every registration/auth form input server-side, not just client-side.
- Rate limiting reuses the existing `lib/rateLimit.ts` pattern, applied to auth endpoints (login attempts, password reset requests) to blunt brute-force/enumeration attempts.

---

## 9. SEO Protection

- `app/sitemap.ts` is an explicit route list (not a directory scan) — new routes are simply never added to it. Verified after this phase's changes that it's unchanged.
- `app/robots.ts` updated to disallow `/portal/`, `/admin/`, `/checkout/`, `/onboarding/`, `/login/`, `/register/`, `/forgot-password/`, `/reset-password/`, `/verify-email/`, in addition to the existing `/api/`.
- Every page under those paths also sets `noindex, nofollow` via metadata (defense in depth — a disallowed-but-linked-from-elsewhere page can still be indexed from the link alone without an explicit noindex tag, so both are needed).
- Zero existing marketing routes, metadata, canonicals, or sitemap entries were touched.

---

## 10. Deployment Changes

- New environment variables must be added in Vercel's Project Settings → Environment Variables (Production **and** Preview, since Preview deployments also need a working Supabase connection for testing) — see `ACENDIA-OWNER-ACTION-REQUIRED.md`.
- No build command or framework preset changes needed — Supabase's SSR client works fine with Vercel's default Next.js build.
- Next.js 16 renamed the `middleware.ts` file convention to `proxy.ts` (this repo uses `proxy.ts` accordingly) and changed the default runtime from Edge to Node.js — no special configuration needed on Vercel either way.
- **Resilience note (found and fixed during this pass):** `proxy.ts` runs on almost every request, including every public marketing page. Early in this build it called `createServerClient()` unconditionally, which throws if the Supabase env vars aren't set — meaning the entire site (not just the new auth pages) 500'd whenever Supabase wasn't configured. Fixed by making the Supabase-dependent logic conditional on the env vars actually being present, and by wrapping every other Supabase call this phase introduces (`lib/auth.ts`, `lib/plans.ts`) in try/catch so they degrade to "signed out" / "no plans" instead of throwing. Verified in-browser: with Supabase completely unconfigured, the homepage, `/pricing`, and `/register` all still render correctly.

---

## 11. Phase Breakdown (full project)

| Phase | Scope | Status |
|---|---|---|
| **Foundation** | Plan doc, DB schema + RLS, Supabase auth, registration wizard, login/password-reset, `/pricing` with real pricing, SEO protection, env scaffolding | **Complete** |
| **Phase 2 — Payments** | Stripe Checkout + Billing + webhooks + Customer Portal; PayPal Subscriptions + webhooks; Wise payment-link flow; real `/checkout` flow; subscription activation on verified webhook only | **Complete** — code-complete; needs real (sandbox or live) provider credentials from the owner to actually process a payment (see §12) |
| **Phase 3 — Client Portal** | `/portal` dashboard, campaign, SEO performance, tasks, reports, files, messages, support, billing, settings | **Complete** |
| **Phase 4 — Admin Portal** | `/admin` dashboard, client management, manual client creation, plan management, activity/audit log review | **Complete** |
| **Phase 5 — Comms, Testing, Docs** | Transactional emails (Resend), in-app notifications, automated tests for the critical flows listed in the brief, final `CLIENT-PORTAL-SETUP.md` completion, `ACENDIA-OWNER-ACTION-REQUIRED.md` completion | **Complete** |

This mirrors the same "propose scope → build → report → confirm next phase" pattern used for the rest of this site build.

---

## 12. Phases 2-5 — What Was Actually Built

### Phase 2 — Payments
- **Provider abstraction** (`lib/payments/types.ts`): `isProviderConfigured(provider)` checks env-var presence per provider so checkout only ever offers a payment method that will actually work — never a dead option.
- **Stripe** (`lib/payments/stripe.ts`): `createStripeCheckoutSession()` (subscription mode, one-time setup-fee line item, `client_reference_id`/metadata carry `organizationId`), `createStripeCustomerPortalSession()`, `constructStripeWebhookEvent()` (signature-verified, returns `null` — never throws — on bad signature or missing config).
- **PayPal** (`lib/payments/paypal.ts`): plain `fetch()`-based OAuth client-credentials flow (cached token), `createPaypalSubscription()`, `verifyPaypalWebhookSignature()` (via PayPal's own verify-webhook-signature API, since PayPal doesn't support local HMAC verification the way Stripe does).
- **Wise** (`lib/payments/wise.ts`): **manual-only, by design** — `generateWiseReference()` produces a unique reference (`ACND-{orgId}-{timestamp}`) the client is shown at checkout and must include in their transfer; a `payments` row is created with `status='pending'`; nothing auto-activates. Activation only happens when staff clicks **Confirm Payment Received** in `/admin/payments` (`app/api/admin/payments/confirm/route.ts`) — the one and only code path that can mark a Wise payment `paid`.
- **Checkout flow**: `app/api/checkout/create/route.ts` re-derives the plan and price **from the `plans` table**, never from the request body; creates/reuses a `pending` `subscriptions` row; branches per provider. `app/checkout/page.tsx` + `components/checkout/CheckoutClient.tsx` render only the providers `isProviderConfigured()` says are ready.
- **Webhooks**: `app/api/webhooks/stripe/route.ts` and `app/api/webhooks/paypal/route.ts` — both signature-verified, both idempotent via a `(provider, event_id)` unique-constrained insert into `payment_webhook_events` *before* processing, both update `subscriptions`/`payments`/`activity_logs`, both trigger the client notification + email described in Phase 5.
- **`/checkout/success`** reads the **real** subscription status from the database and reflects it back — it is never itself the source of truth that a payment succeeded, per the brief's explicit requirement.
- Stripe/PayPal price & plan IDs live on the `plans` table (`stripe_price_id_monthly`, `paypal_plan_id_monthly`), not in env vars — see `supabase/migrations/0005_payment_provider_ids_template.sql`.

### Phase 3 — Client Portal (`/portal/*`)
Shared shell: `app/portal/layout.tsx` (sidebar nav, org name, notification bell, sign out) + `lib/portal.ts`'s `getPortalContext()` (cached per-request; redirects to `/register/` if a signed-in user has no organization yet).
- `/portal` — dashboard: subscription status, campaign health/stage, current work, action-required-from-you, quick links to latest report and billing.
- `/portal/campaign` — project stage timeline, active services, target keywords/locations, milestones.
- `/portal/seo` — keyword rankings, organic traffic, leads — all real `keyword_metrics`/`traffic_metrics`/`lead_metrics` rows, empty-state until real data exists (never estimated or fabricated).
- `/portal/tasks`, `/portal/reports` (published-only), `/portal/files` (Supabase Storage signed URLs, 10-min expiry), `/portal/messages` (conversation thread + send), `/portal/billing` (plan, renewal, payment history, Stripe Customer Portal button), `/portal/support` (ticket submission + history), `/portal/settings` (profile + business name).

### Phase 4 — Admin Portal (`/admin/*`)
Shared shell: `app/admin/layout.tsx` + `lib/admin.ts`'s `getAdminContext()` (role-gated `staff`/`admin`/`super_admin`, RLS is the real boundary underneath).
- `/admin` — dashboard KPIs (total/new clients, active subscriptions, MRR computed from real active-subscription plan prices, pending onboarding, past-due accounts, tasks waiting on client, open tickets) + a banner surfacing any Wise payments awaiting confirmation.
- `/admin/clients` + `/admin/clients/[id]` — client list/detail (business info, contacts, subscriptions with inline status override, campaign snapshot, recent tickets).
- `/admin/clients/new` — manual client creation: creates a real Supabase Auth user (`admin.auth.admin.createUser`), organization, membership, optional pending plan, and returns a password-set link (`admin.auth.admin.generateLink`) for staff to send directly, since email delivery isn't assumed.
- `/admin/projects`, `/admin/tasks` (inline status change), `/admin/reports` (publish/unpublish — publishing triggers the client notification + email), `/admin/payments` (**the Wise confirmation queue** — this is the operational heart of the Wise flow), `/admin/subscriptions` (list + inline status override, logged to `activity_logs`), `/admin/messages` + `/admin/messages/[id]` (staff reply to any client conversation), `/admin/plans` (view; activate/deactivate is admin+ only per RLS — price/feature edits stay in Supabase's Table Editor by design, so checkout amounts can never be UI-tampered), `/admin/activity` (full audit trail).

### Phase 5 — Comms, Notifications, Tests
- **`lib/email.ts`**: Resend wrapper, gated behind `RESEND_API_KEY`/`EMAIL_FROM` — every send is try/catch-wrapped and logs-and-continues rather than throwing, so a missing/misconfigured Resend key never breaks a webhook, ticket submission, or message send. Templates: subscription activated, Wise payment confirmed, payment failed, new message, new report, plus three admin-facing templates (new client message, new support ticket, new signup) sent to `ADMIN_NOTIFICATION_EMAIL`.
- **`lib/notifications.ts`**: in-app notifications, always written via the service-role client (the RLS `notifications_insert_staff` policy intentionally blocks a client from writing their own notification rows). `notifyOrganization()` fans out to every org member.
- **Notification bell**: `components/portal/NotificationBell.tsx` in the portal header — unread badge, dropdown, mark-all-read.
- **Wired trigger points**: Stripe/PayPal webhook activation, Wise confirmation, payment-failed (both providers), admin message reply, client message (→ admin email), new support ticket (→ admin email), report publish, new registration (→ admin email).
- **Automated tests** (`tests/`, run via `npm test`, using Vitest): payment-provider config gating, Wise reference generation, registration Zod schema validation (password match, uuid-only plan IDs, password never re-echoed in the server payload), rate-limiter behavior. **What isn't covered by automated tests** — and why: true end-to-end flows (registration → email verification → login; Stripe/PayPal checkout → webhook → active; org-isolation via RLS) require a live Supabase project and live/sandbox Stripe & PayPal credentials, none of which exist in this environment. §13 below is the manual QA checklist to run once those credentials are in place.

---

## 13. Manual QA Checklist (run once real credentials exist)

1. **Registration → verification → login**: `/register/` through all 5 steps → confirmation email arrives → click link → `/login/` → land on `/portal/`.
2. **Org isolation**: create two client accounts (A and B). Confirm A cannot see B's tasks/files/messages/reports by trying `/portal/...` URLs directly — RLS should return empty results, not an error leaking existence.
3. **Stripe checkout → webhook → active**: complete checkout with a Stripe test card → `/checkout/success` shows "confirming" → within seconds, Stripe sends `checkout.session.completed` → subscription flips to `active` in `/portal/billing` and `/admin/subscriptions`, notification + email arrive.
4. **PayPal subscription → webhook → active**: same, via PayPal sandbox buyer account.
5. **Wise pending → admin confirms → active**: choose Wise at checkout → reference is shown → in `/admin/payments`, click **Confirm Payment Received** → subscription activates, client is notified.
6. **Failed payment → past_due**: use a Stripe test card that declines on renewal → `customer.subscription.updated`/`invoice.payment_failed` → subscription flips to `past_due`, client sees the billing banner + email.
7. **Cancellation**: cancel via the Stripe Customer Portal → `customer.subscription.deleted` → status `cancelled`.
8. **Admin-can / client-cannot**: confirm a `client`-role login gets redirected away from `/admin` (`requireRole` + RLS both block it); confirm `staff` can reach `/admin` but plan activation toggles are hidden/blocked (admin+ only, per RLS `plans_write_admin`).
