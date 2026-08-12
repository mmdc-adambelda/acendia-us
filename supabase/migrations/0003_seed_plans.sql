-- Acendia Client Portal — seed real plan pricing (as provided by the owner)
-- Run after 0001_schema.sql and 0002_rls_policies.sql.
--
-- Quarterly/annual prices are intentionally left NULL — the pricing page
-- only renders billing cycles with a real, non-null price. Add those rates
-- later via /admin (once built) or a follow-up SQL UPDATE.

insert into plans (
  name, slug, description, plan_type,
  setup_fee_cents, monthly_price_cents,
  wise_available, features, is_active, display_order
) values (
  'Acendia Growth Package',
  'growth-package',
  'Acendia''s core SEO and digital growth engagement — a one-time setup followed by ongoing monthly work.',
  'core',
  19900,  -- $199 one-time setup fee
  49900,  -- $499/month
  true,
  array[
    'One-time setup and onboarding',
    'Ongoing SEO strategy and execution',
    'Local search and Google Business Profile optimization',
    'Monthly progress reporting',
    'Direct access to your account team via the client portal'
  ],
  true,
  1
);

insert into plans (
  name, slug, description, plan_type,
  monthly_price_cents,
  wise_available, features, is_active, display_order
) values (
  'Social Media Management',
  'social-media-addon',
  'Optional add-on for clients on the Growth Package who want ongoing social media management alongside their SEO work.',
  'addon',
  29900,  -- $299/month
  true,
  array[
    'Ongoing social media content and posting',
    'Managed as an add-on to an active Acendia plan'
  ],
  true,
  2
);
