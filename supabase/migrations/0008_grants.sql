-- Fixes "permission denied for table X" (Postgres error 42501) errors.
--
-- Supabase projects normally auto-grant base table access to the anon/
-- authenticated roles when they're provisioned, so migrations 0001-0007
-- never needed to do this explicitly — but that auto-grant didn't take
-- effect on this project. RLS policies (0002_rls_policies.sql) are a
-- SECOND layer that restricts access at the row level; they do nothing
-- if the role doesn't have the underlying object-level GRANT to touch the
-- table at all, which is exactly what was missing here. Confirmed live:
-- `select * from plans` as the anon role returned 42501 even though the
-- RLS policy on plans explicitly allows `is_active = true` rows through.
--
-- Run this after 0001-0007. Safe to re-run (GRANT is idempotent).

-- The only table an anonymous (not-yet-signed-up) visitor needs to read —
-- /pricing/ and /register/ both query it before any auth exists. Every
-- other table is only ever queried by an authenticated user.
grant select on public.plans to anon;

-- RLS is the real access-control layer for everything else — this just
-- lets the authenticated role through the front door so RLS can then do
-- its job. Without this, a logged-in client/staff/admin user gets 42501
-- on every single query, same as the anon role did on `plans`.
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
-- Sequences only support usage/select/update — insert/delete aren't valid
-- privilege types for a sequence (Postgres error 0LP01 if you try).
grant usage, select, update on all sequences in schema public to authenticated;

-- Applies the same grant automatically to any table added by a future
-- migration, so this specific problem can't silently recur.
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select on sequences to authenticated;
