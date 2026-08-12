# Acendia Client Portal — Setup Guide (for the Acendia owner/admin)

This is written for you, not developers — step-by-step, with exactly where to click. Foundation-phase steps (Supabase) are needed **now** for the portal to actually work. The Stripe/PayPal/Wise/Email sections describe what **Phase 2 and Phase 5** will need — you don't need to do those yet, but the instructions are here so you can prepare or hand this off later.

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

### 1.6 Add the same environment variables to Vercel

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

## Part 2: Stripe (Phase 2 — not needed yet)

This section is here for when Phase 2 (real checkout) is built. Nothing to do yet.

1. Create a Stripe account at [stripe.com](https://stripe.com) if you don't have one.
2. Stay in **Test mode** (toggle in the top-right of the Stripe Dashboard) until everything is verified working.
3. Go to **Products** → create a product called "Acendia Growth Package" with a recurring price of $499/month, and a separate one-time price of $199 for setup (or a combined price, depending on how Phase 2 implements the setup fee — this will be finalized when that phase is built).
4. Create a second product, "Social Media Management," at $299/month recurring.
5. Copy each **Price ID** (starts with `price_...`) — these go into `STRIPE_PRICE_ID_GROWTH_PACKAGE_MONTHLY` and `STRIPE_PRICE_ID_SOCIAL_MEDIA_ADDON_MONTHLY`.
6. Go to **Developers** → **API keys**. Copy the **Secret key** (`sk_test_...` in test mode) into `STRIPE_SECRET_KEY`, and the **Publishable key** (`pk_test_...`) into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
7. Once webhook handling is built (Phase 2), go to **Developers** → **Webhooks** → **Add endpoint**, point it at `https://acendia.us/api/webhooks/stripe`, and copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
8. Configure the **Customer Portal** (Settings → Billing → Customer portal) with your branding before going live.
9. When ready for real payments, switch the Dashboard toggle to **Live mode** and repeat steps 5-7 for live keys.

## Part 3: PayPal (Phase 2 — not needed yet)

1. Create a PayPal **Business** account at [paypal.com](https://paypal.com) if you don't have one.
2. Go to [developer.paypal.com](https://developer.paypal.com) → **Apps & Credentials**.
3. Make sure you're in **Sandbox** mode (toggle at the top) for testing.
4. Click **Create App**, name it "Acendia US".
5. Copy the **Client ID** into `PAYPAL_CLIENT_ID` and the **Secret** into `PAYPAL_CLIENT_SECRET`.
6. Set `PAYPAL_ENVIRONMENT=sandbox` for now.
7. Once Phase 2 builds subscription plan creation, you'll create Products/Plans either via the API or Dashboard, matching the Stripe plan structure.
8. Configure a webhook (Developer Dashboard → your app → Webhooks) pointed at `https://acendia.us/api/webhooks/paypal` once that endpoint exists; copy the **Webhook ID** into `PAYPAL_WEBHOOK_ID`.
9. Switch to **Live** credentials and `PAYPAL_ENVIRONMENT=live` when ready for real payments.

## Part 4: Wise (Phase 2 — not needed yet)

Wise doesn't offer Stripe-style automated subscription billing — see `CLIENT-PORTAL-IMPLEMENTATION.md` §5 for why. What you'll need when Phase 2 builds this:

1. Confirm your **Wise Business** account is verified and can receive payments from US customers.
2. Log in to Wise, go to **Get Paid** (or equivalent) and check whether your account has **payment link** functionality available (this varies by account/region — Wise's available features aren't identical everywhere).
3. If payment links are available, generate one (or note the process) — this becomes `WISE_PAYMENT_LINK`.
4. Check whether your account has API access for transaction reconciliation (**Settings** → **API tokens**, or contact Wise support) — this determines whether Phase 2 can automate payment confirmation or whether it must stay a manual "admin marks as paid" process, as required by the brief.
5. If an API token is available, generate one into `WISE_API_TOKEN`, and find your **Profile ID** into `WISE_PROFILE_ID`.

## Part 5: Transactional Email (Phase 5 — not needed yet)

1. Create a [Resend](https://resend.com) account (or tell us if you'd prefer a different provider).
2. Add and verify your sending domain (e.g. `mail.acendia.us`) — Resend will give you DNS records (usually a few `TXT` and `CNAME` records) to add wherever `acendia.us`'s DNS is managed.
3. Create an API key, copy it into `RESEND_API_KEY`.
4. Set `EMAIL_FROM` to something like `Acendia <hello@acendia.us>` and `ADMIN_NOTIFICATION_EMAIL` to the inbox that should get new-client/payment alerts.

## Part 6: Domain & Vercel

1. The site currently lives at `https://acendia-us.vercel.app`. To connect `acendia.us`: in Vercel, go to the project → **Settings** → **Domains** → add `acendia.us`, then follow Vercel's DNS instructions (usually an `A` record or `CNAME` at your domain registrar).
2. Once connected, update `NEXT_PUBLIC_APP_URL` in Vercel's environment variables to `https://acendia.us`, and update the Supabase Redirect URLs (step 1.4) and Site URL to match.
3. Any webhook URLs (Stripe/PayPal/Wise, once built) must point at the final production domain, not the `.vercel.app` one, before going live with real payments.
