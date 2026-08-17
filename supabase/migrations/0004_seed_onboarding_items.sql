-- Acendia Client Portal — default onboarding checklist template
-- Run after 0001-0003. Per-organization completion state lives in
-- onboarding_responses (see 0001_schema.sql), not here.
--
-- Run this exactly once. There was no unique constraint on `label` to stop
-- a second run from silently duplicating all 11 rows — that happened live
-- (see 0010_dedupe_onboarding_items.sql, which cleans it up and adds the
-- constraint). After 0010 has run, re-running this file will correctly
-- fail with a duplicate-key error instead of duplicating rows again.

insert into onboarding_items (label, description, display_order) values
  ('Business information', 'Confirm your business details are accurate.', 1),
  ('Website details', 'Confirm your website URL and primary service.', 2),
  ('Google Search Console access', 'Grant Acendia access so we can track search performance.', 3),
  ('Google Analytics access', 'Grant Acendia access to your GA4 property.', 4),
  ('Google Business Profile access', 'Add Acendia as a manager on your Google Business Profile.', 5),
  ('Website access', 'Provide login access (or a staging/dev environment) for implementation work.', 6),
  ('Target services confirmed', 'Confirm which services are in scope for your campaign.', 7),
  ('Target locations confirmed', 'Confirm the cities/states your campaign should prioritize.', 8),
  ('Competitors listed', 'Share who you consider your main competitors.', 9),
  ('Brand assets', 'Share your logo, brand guidelines, and any existing marketing assets.', 10),
  ('Campaign goals confirmed', 'Confirm your primary goal so we can align strategy and reporting.', 11);
