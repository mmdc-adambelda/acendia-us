-- Fixes "0 of 22 complete" instead of "0 of 11" on /onboarding — found
-- live: onboarding_items had no unique constraint on `label`, so running
-- 0004_seed_onboarding_items.sql a second time silently inserted all 11
-- default checklist items again instead of erroring.
--
-- This migration:
--   1. For each duplicated label, keeps one row and re-points any
--      per-organization completion state (onboarding_responses) that was
--      recorded against a duplicate onto the row being kept, so nothing
--      already marked complete is lost.
--   2. Deletes the now-redundant duplicate rows.
--   3. Adds the missing unique constraint, so this can't happen again —
--      re-running 0004 in the future will now fail loudly with a clear
--      duplicate-key error instead of silently duplicating rows.
--
-- Safe to run once. Re-running after it's already applied is a no-op (the
-- loop below only touches labels that currently have duplicates).

do $$
declare
  keep record;
begin
  for keep in
    -- min(uuid) doesn't exist in Postgres (no default ordering operator
    -- class for the type) -- cast through text to pick a deterministic
    -- "keeper" instead. Which specific duplicate survives doesn't matter,
    -- only that exactly one does.
    select label, min(id::text)::uuid as keep_id
    from onboarding_items
    group by label
    having count(*) > 1
  loop
    -- If an org already has a response against BOTH the keeper and a
    -- duplicate (very unlikely this early, but possible), drop the
    -- duplicate's response rather than fail on the unique constraint below
    -- when we repoint it.
    delete from onboarding_responses r
    using onboarding_items dup
    where r.onboarding_item_id = dup.id
      and dup.label = keep.label
      and dup.id <> keep.keep_id
      and exists (
        select 1 from onboarding_responses r2
        where r2.organization_id = r.organization_id
          and r2.onboarding_item_id = keep.keep_id
      );

    update onboarding_responses
    set onboarding_item_id = keep.keep_id
    where onboarding_item_id in (
      select id from onboarding_items where label = keep.label and id <> keep.keep_id
    );

    delete from onboarding_items
    where label = keep.label and id <> keep.keep_id;
  end loop;
end $$;

alter table onboarding_items add constraint onboarding_items_label_key unique (label);

-- Verify: should return 11.
-- select count(*) from onboarding_items;
