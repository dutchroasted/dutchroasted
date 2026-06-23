create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  category text,
  intensity text,
  wants_updates boolean default false,
  created_at timestamp with time zone default now()
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free' check (plan in ('free', 'premium', 'pro')),
  subscription_status text default 'inactive' check (subscription_status in ('active', 'inactive')),
  stripe_customer_id text,
  stripe_subscription_id text,
  daily_roast_count integer default 0,
  daily_roast_date date,
  created_at timestamp with time zone default now()
);

create index if not exists profiles_plan_idx on public.profiles (plan);
create index if not exists profiles_daily_roast_date_idx on public.profiles (daily_roast_date);
create unique index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;
create unique index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;
