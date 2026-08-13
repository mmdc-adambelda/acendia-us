-- Fixes "permission denied for table profiles" (Postgres 42501) coming from
-- the SERVER's admin (service_role) client — a different, more severe
-- version of the same gap 0008_grants.sql fixed for anon/authenticated.
--
-- service_role is normally auto-configured by Supabase to bypass RLS and
-- object grants entirely on a freshly-provisioned project. On this project
-- that auto-configuration didn't take effect either, so registration
-- completion (which always writes via the admin/service_role client — see
-- app/api/register/complete/route.ts) failed with exactly this error the
-- moment it tried to read/write `profiles`. Confirmed live via the API's
-- returned Postgres error: 42501, hint "GRANT ... ON public.profiles TO
-- service_role".
--
-- Run this after 0008_grants.sql. Safe to re-run (GRANT is idempotent).

grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
-- Sequences only support usage/select/update — see 0008_grants.sql's note.
grant usage, select, update on all sequences in schema public to service_role;

-- Applies the same grant automatically to any table added by a future
-- migration, so this can't silently recur for service_role either.
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;
