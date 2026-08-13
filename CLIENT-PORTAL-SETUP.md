# Acendia Client Portal — Setup Guide (for the Acendia owner/admin)

This is written for you, not developers — step-by-step, with exactly where to click. **All 5 phases are now fully built and code-complete.** Every part below (Supabase, Stripe, PayPal, Wise, Resend, domain) is something you need to actually do to bring the portal fully live — none of it is "later" anymore. See `ACENDIA-OWNER-ACTION-REQUIRED.md` for the single prioritized checklist; this document has the detailed how-to for each item.

---

## Part 1: Supabase (needed now)

You already have a project: `https://eqedvioirmitcwtobjzk.supabase.co`. Here's how to finish connecting it.

### 1.1 Get your API keys

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, click **Project Settings** (gear icon) → **API**.
3. You'll see three values:
   - **Project URL** — already in the code (`https://eqedvioirmitcwtobjzk.supabase.co`)
   - **anon / public key** — a long string starting with `eyJ...`. This is safe to expose publicly.
   - **service_role key** — another long string starting with `eyJ...`. **Treat this like a master password** — anyone with it can read/write your entire database, bypassing all security rules.

### 1.2 Add the keys locally

1. Open `.env.local` in the project (already created for you with the URL filled in).
2. Paste the **anon public key** into `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
3. Paste the **service_role key** into `SUPABASE_SERVICE_ROLE_KEY=`
4. Save the file. `.env.local` is already excluded from Git (via `.gitignore`) — it will never be committed or pushed to GitHub.

### 1.3 Run the database migrations

The database tables don't exist yet — you need to run 4 SQL files once.

1. In the Supabase Dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase/migrations/0001_schema.sql` from this project, copy its entire contents, paste into the SQL Editor, and click **Run**.
4. Repeat for `supabase/migrations/0002_rls_policies.sql`.
5. Repeat for `supabase/migrations/0003_seed_plans.sql` (this loads your real pricing: $199 setup + $499/mo Growth Package, $299/mo Social Media add-on).
6. Repeat for `supabase/migrations/0004_seed_onboarding_items.sql` (this loads the default onboarding checklist).
7. Repeat for `supabase/migrations/0006_add_went_live_at.sql` (adds the column staff uses to record a client's real go-live date — see "Real billing schedule" below) and `supabase/migrations/0007_rename_plans.sql` (renames the seeded plans to "SEO Package" / "Social Media Add-On", if you ran 0003 before this rename shipped — safe to skip if you're running everything fresh, since 0003 already uses the new names).
8. Run `supabase/migrations/0008_grants.sql` — **required**, not optional. Supabase normally auto-configures base table permissions for new projects, but that didn't happen here; without this file, every table returns "permission denied for table X" even though the schema and RLS policies are otherwise correct. If you already registered a test account and got stuck on "No active plan is configured yet," this is why — run this file and it'll immediately resolve.

**Note on `0005_payment_provider_ids_template.sql`**: this one is a template, not a numbered step to run as-is — see Part 2 below.

Run them **in that exact order** (0001 → 0002 → 0003 → 0004) — later files depend on tables/policies created by earlier ones.

**How to verify it worked:** In the Supabase Dashboard sidebar, click **Table Editor**. You should see tables like `profiles`, `organizations`, `plans`, `subscriptions`, etc. Click on `plans` — you should see 2 rows: "Acendia Growth Package" and "Social Media Management".

### 1.4 Configure authentication redirect URLs

Supabase needs to know which URLs are allowed to receive password-reset and email-confirmation links.

1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration**.
2. Set **Site URL** to your production URL (e.g. `https://acendia.us` once the domain is connected, or `https://acendia-us.vercel.app` for now).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**` (for local development)
   - `https://acendia-us.vercel.app/**` (current live URL)
   - `https://acendia.us/**` (once the custom domain is connected)

### 1.5 Email confirmation is on by default

Supabase requires email verification before an account can log in, out of the box — no action needed. If you want to customize the confirmation email's look (currently Supabase's generic template), go to **Authentication** → **Email Templates** and edit the "Confirm signup" template. This is optional and can be done anytime.

### 1.6 Create the private file storage bucket (needed for `/portal/files`)

1. In the Supabase Dashboard, go to **Storage** → **Create a new bucket**.
2. Name it exactly `client-files`, and leave it **Private** (do not make it public — files are served via short-lived signed URLs generated server-side, never a public URL).
3. No further configuration needed — the app writes files at `{organization_id}/{filename}` and reads them back with RLS-equivalent checks in application code.

### 1.7 Add the same environment variables to Vercel

The keys you added to `.env.local` only work on your own computer. For the live site to work, add the same three variables in Vercel:

1. Go to [vercel.com](https://vercel.com), open the `acendia-us` project.
2. Click **Settings** → **Environment Variables**.
3. Add each of these for **both Production and Preview** environments:
   - `NEXT_PUBLIC_APP_URL` = `https://acendia.us` (or your current Vercel URL)
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://eqedvioirmitcwtobjzk.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (the anon key from step 1.1)
   - `SUPABASE_SERVICE_ROLE_KEY` = (the service_role key from step 1.1 — mark this one **Sensitive** in Vercel's UI if offered, so it's hidden from the dashboard after saving)
4. Redeploy (Vercel usually does this automatically after saving env vars, or trigger one manually from the Deployments tab).

**How to test it works:** visit `/register/` on the live site and go through the first step (Account). You should get a confirmation email. If you don't, double check the anon key was copied correctly (no extra spaces) and that the Site URL/Redirect URLs in step 1.4 are correct.

---

## Real billing schedule (confirmed by you, built into checkout)

This is the actual payment timeline every provider below follows — not the industry-default "charge everything today":

1. **Today** — the client pays only the one-time setup fee at checkout. Nothing recurring is created or charged yet.
2. **~2-3 business days later** — their site typically goes live (varies by project).
3. **14 days after that real go-live date** — the first monthly charge happens automatically.

Because the exact go-live date isn't known at checkout, the system uses an estimate (19 days from signup) until a staff member records the real date. **You do this in `/admin/clients/[client]` — click "Mark Site Live" and enter the actual date.** That one action:
- Corrects the Stripe subscription's billing date to the *exact* 14-days-after-go-live date (no re-approval needed from the client).
- For Wise, generates the next invoice (the first monthly payment) for you to send the client near that date.
- For PayPal, only updates your own records — see the PayPal section below for why the date can't be corrected there.

**Do this for every client once their site is actually live** — it's the only way the billing date becomes exact instead of an estimate.

---

## Part 2: Stripe (Phase 2 — code is live, needs your account)

Card checkout won't appear as an option on `/checkout` until `STRIPE_SECRET_KEY` is set — the code checks for it and hides the option rather than offering something broken.

1. Create a Stripe account at [stripe.com](https://stripe.com) if you don't have one.
2. Stay in **Test mode** (toggle in the top-right of the Stripe Dashboard) until everything is verified working.
3. Go to **Products** → create a product called "SEO Package" with a recurring price of $499/month.
4. Create a second product, "Social Media Add-On," at $299/month recurring.
5. Copy each recurring **Price ID** (starts with `price_...`). These do **not** go into an env var — copy `supabase/migrations/0005_payment_provider_ids_template.sql`, fill in the real Price IDs, and run it in the Supabase SQL Editor (this sets `plans.stripe_price_id_monthly`). The one-time $199 setup fee needs no separate Stripe product — it's charged as an ad-hoc Checkout line item today, and the $499/$299 Price IDs above are only used ~14 days after go-live when the real subscription is created.
6. Go to **Developers** → **API keys**. Copy the **Secret key** (`sk_test_...` in test mode) into `STRIPE_SECRET_KEY`, and the **Publishable key** (`pk_test_...`) into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
7. Go to **Developers** → **Webhooks** → **Add endpoint**, point it at `https://acendia.us/api/webhooks/stripe`, subscribe to at least `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, and copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
8. Configure the **Customer Portal** (Settings → Billing → Customer portal) with your branding — this is what the "Manage Billing" button in `/portal/billing` opens.
9. When ready for real payments, switch the Dashboard toggle to **Live mode** and repeat steps 5-7 for live keys (and re-run the migration template with live Price IDs).

## Part 3: PayPal (Phase 2 — code is live, needs your account)

PayPal won't appear as a checkout option until both `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set.

**Important limitation, please read before setting this up:** PayPal Subscriptions don't support a separate one-time setup-fee charge the way Stripe does, and once a subscription is approved, PayPal won't let us move its first-billing date the way we can with Stripe. Two ways to handle this — pick one when you create your Plan in step 7:
- **Recommended:** give the Plan a first billing cycle that's a one-time $199 charge (`tenure_type: TRIAL`, 1 cycle), followed by the regular $499/mo cycle. The client approves once, pays the $199 immediately, and the $499/mo cycle starts automatically after that trial cycle ends — set the trial cycle's duration to your best estimate of "when this client's site will be live + 14 days" (19 days is what the code defaults to for Stripe/Wise).
- **Simpler, less accurate:** skip the trial cycle and let the code's `start_time` estimate (19 days out) apply directly to a $499/mo-only Plan; you'll need to separately invoice the $199 setup fee (e.g. via a Wise/Stripe one-off, or a manual PayPal invoice) since the Plan alone won't collect it.

1. Create a PayPal **Business** account at [paypal.com](https://paypal.com) if you don't have one.
2. Go to [developer.paypal.com](https://developer.paypal.com) → **Apps & Credentials**.
3. Make sure you're in **Sandbox** mode (toggle at the top) for testing.
4. Click **Create App**, name it "Acendia US".
5. Copy the **Client ID** into `PAYPAL_CLIENT_ID` and the **Secret** into `PAYPAL_CLIENT_SECRET`.
6. Set `PAYPAL_ENVIRONMENT=sandbox` for now.
7. Create a Product + Plan (via the PayPal Dashboard or API) using one of the two structures above ($499/mo SEO Package, $299/mo Social Media Add-On). Copy each Plan ID (starts with `P-...`) into `supabase/migrations/0005_payment_provider_ids_template.sql` (`paypal_plan_id_monthly`) and run it in the Supabase SQL Editor.
8. Configure a webhook (Developer Dashboard → your app → Webhooks) pointed at `https://acendia.us/api/webhooks/paypal`, subscribed to at least `BILLING.SUBSCRIPTION.ACTIVATED`, `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.EXPIRED`, `BILLING.SUBSCRIPTION.SUSPENDED`, `PAYMENT.SALE.DENIED`; copy the **Webhook ID** into `PAYPAL_WEBHOOK_ID`.
9. Switch to **Live** credentials and `PAYPAL_ENVIRONMENT=live` when ready for real payments.

## Part 4: Wise (Phase 2 — code is live; intentionally manual, not automated)

Wise doesn't offer Stripe-style automated subscription billing — see `CLIENT-PORTAL-IMPLEMENTATION.md` §5 for why. The built flow: a client choosing Wise at checkout gets a unique reference and (if configured) a payment link; **your team manually confirms the transfer arrived in `/admin/payments`**, which is what actually activates their subscription. Nothing here auto-activates.

1. Confirm your **Wise Business** account is verified and can receive payments from US customers.
2. Log in to Wise, go to **Get Paid** (or equivalent) and check whether your account has **payment link** functionality available (this varies by account/region).
3. If payment links are available, generate one — this becomes `WISE_PAYMENT_LINK`. Wise won't appear as a checkout option until this is set (if you don't have a payment link, clients can still be told the reference and asked to wire manually — set `WISE_PAYMENT_LINK` to any placeholder page in that case, or ask us to hide Wise entirely).
4. `WISE_API_TOKEN`/`WISE_PROFILE_ID` are optional — reserved for a future automated-reconciliation upgrade. Today's flow doesn't require them; confirmation is manual via `/admin/payments` by design (this is what the original brief requires — Wise must never be presented as equivalent to instant/automatic activation).

## Part 5: Transactional Email (Phase 5 — code is live, needs your account)

Emails (payment confirmations, new messages, new reports, admin alerts) are silently skipped (logged to the server console only) until `RESEND_API_KEY` and `EMAIL_FROM` are set — nothing breaks without it, you just won't get the emails yet.

1. Create a [Resend](https://resend.com) account (or tell us if you'd prefer a different provider).
2. Add and verify your sending domain (e.g. `mail.acendia.us`) — Resend will give you DNS records (usually a few `TXT` and `CNAME` records) to add wherever `acendia.us`'s DNS is managed.
3. Create an API key, copy it into `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to something like `Acendia <hello@acendia.us>` and `ADMIN_NOTIFICATION_EMAIL` to the inbox that should get new-client-signup, new-message, and new-support-ticket alerts.

## Part 6: Domain & Vercel

1. The site currently lives at `https://acendia-us.vercel.app`. To connect `acendia.us`: in Vercel, go to the project → **Settings** → **Domains** → add `acendia.us`, then follow Vercel's DNS instructions (usually an `A` record or `CNAME` at your domain registrar).
2. Once connected, update `NEXT_PUBLIC_APP_URL` in Vercel's environment variables to `https://acendia.us`, and update the Supabase Redirect URLs (step 1.4) and Site URL to match.
3. Any webhook URLs (Stripe/PayPal/Wise, once built) must point at the final production domain, not the `.vercel.app` one, before going live with real payments.
