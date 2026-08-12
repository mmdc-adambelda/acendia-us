-- Adds the go-live timestamp used to compute when monthly billing should
-- actually start (14 days after the client's website goes live — see
-- lib/billing.ts). Run after 0001-0005.

alter table websites add column if not exists went_live_at timestamptz;
