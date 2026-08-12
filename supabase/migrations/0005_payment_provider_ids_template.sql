-- Template — copy this file, fill in your real Stripe/PayPal IDs, and run
-- it in the Supabase SQL Editor once you've created the corresponding
-- products in each provider's dashboard. See CLIENT-PORTAL-SETUP.md
-- Parts 2-3 for exactly where to find these values.
--
-- Do NOT commit real price/plan IDs to this file in the repo — they aren't
-- secret, but this file is a reusable template, not a record of your
-- actual configuration. Keep your filled-in copy locally or run it
-- directly from the Supabase dashboard.

-- Stripe: one recurring Price ID per plan (created under Products in the
-- Stripe Dashboard, Test mode first).
update plans set stripe_price_id_monthly = 'price_REPLACE_ME' where slug = 'growth-package';
update plans set stripe_price_id_monthly = 'price_REPLACE_ME' where slug = 'social-media-addon';

-- PayPal: one Plan ID per plan (created under a Product in the PayPal
-- Developer Dashboard, Sandbox first).
update plans set paypal_plan_id_monthly = 'P-REPLACE_ME' where slug = 'growth-package';
update plans set paypal_plan_id_monthly = 'P-REPLACE_ME' where slug = 'social-media-addon';

-- Verify:
-- select slug, stripe_price_id_monthly, paypal_plan_id_monthly from plans;
