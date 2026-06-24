-- Run once in the Supabase SQL Editor.
-- These tables are accessed through server-side routes with the service role.
-- Browser clients receive no direct table access.

alter table public.leads enable row level security;
alter table public.profiles enable row level security;

revoke all on table public.leads from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;

grant all on table public.leads to service_role;
grant all on table public.profiles to service_role;
