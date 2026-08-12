-- Acendia Client Portal — core schema
-- Run in order: 0001_schema.sql -> 0002_rls_policies.sql -> 0003_seed_plans.sql
-- See CLIENT-PORTAL-SETUP.md for how to run these against your Supabase project.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('client', 'staff', 'admin', 'super_admin');
create type org_member_role as enum ('owner', 'member');

create type plan_type as enum ('core', 'addon', 'custom');
create type billing_cycle as enum ('monthly', 'quarterly', 'annual');

create type payment_provider as enum ('stripe', 'paypal', 'wise');
create type payment_status as enum ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled');
create type subscription_status as enum ('pending', 'trialing', 'active', 'past_due', 'paused', 'cancelled', 'expired');

create type campaign_stage as enum ('audit_benchmark', 'strategy', 'implementation', 'optimization', 'reporting', 'scaling');
create type campaign_health as enum ('on_track', 'needs_attention', 'waiting_for_client', 'reporting');

create type task_status as enum ('planned', 'in_progress', 'waiting_for_client', 'review', 'completed', 'blocked');
create type ticket_status as enum ('open', 'in_progress', 'waiting_for_client', 'resolved', 'closed');

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  role user_role not null default 'client',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a profile row whenever a new auth user is created.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- organizations (the client company / tenancy boundary)
-- ---------------------------------------------------------------------------
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  employee_count text,
  city text,
  state text,
  zip text,
  address text,
  phone text,
  account_manager_id uuid references profiles(id),
  onboarding_status text not null default 'not_started', -- not_started | in_progress | completed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger organizations_set_updated_at before update on organizations
  for each row execute function set_updated_at();

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role org_member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ---------------------------------------------------------------------------
-- websites & locations
-- ---------------------------------------------------------------------------
create table websites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  url text not null,
  primary_service text,
  target_service text,
  current_seo_provider text,
  google_business_profile_url text,
  competitors text[],
  approx_monthly_leads text,
  approx_monthly_traffic text,
  primary_challenge text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger websites_set_updated_at before update on websites
  for each row execute function set_updated_at();

create table locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  label text not null, -- e.g. "Houston, TX"
  city text,
  state text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- plans (admin-configurable package catalog)
-- ---------------------------------------------------------------------------
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  plan_type plan_type not null default 'core',
  setup_fee_cents integer, -- one-time fee, null if none
  monthly_price_cents integer,
  quarterly_price_cents integer,
  annual_price_cents integer,
  stripe_price_id_monthly text,
  stripe_price_id_quarterly text,
  stripe_price_id_annual text,
  paypal_plan_id_monthly text,
  paypal_plan_id_quarterly text,
  paypal_plan_id_annual text,
  wise_available boolean not null default true,
  features text[] not null default '{}',
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger plans_set_updated_at before update on plans
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- subscriptions, payments, invoices, webhook events
-- ---------------------------------------------------------------------------
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  plan_id uuid not null references plans(id),
  billing_cycle billing_cycle not null default 'monthly',
  payment_provider payment_provider,
  status subscription_status not null default 'pending',
  stripe_customer_id text,
  stripe_subscription_id text,
  paypal_subscriber_id text,
  paypal_subscription_id text,
  wise_reference text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  terms_version text,
  service_agreement_version text,
  terms_accepted_at timestamptz,
  terms_accepted_by uuid references profiles(id),
  terms_accepted_ip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger subscriptions_set_updated_at before update on subscriptions
  for each row execute function set_updated_at();

create table payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  payment_provider payment_provider not null,
  status payment_status not null default 'pending',
  amount_cents integer not null,
  currency text not null default 'usd',
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  paypal_transaction_id text,
  wise_reference text,
  description text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  payment_id uuid references payments(id) on delete set null,
  invoice_number text not null unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status payment_status not null default 'pending',
  pdf_url text,
  issued_at timestamptz not null default now(),
  due_at timestamptz,
  paid_at timestamptz
);

-- Idempotency guard: every processed webhook event ID is stored before
-- acting on it, so duplicate delivery from Stripe/PayPal/Wise can never
-- cause the same action (e.g. activating a subscription) twice.
create table payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider payment_provider not null,
  event_id text not null,
  event_type text not null,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_id)
);

-- ---------------------------------------------------------------------------
-- projects / campaigns
-- ---------------------------------------------------------------------------
create table projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  name text not null,
  primary_objective text,
  target_keywords text[] default '{}',
  target_cities text[] default '{}',
  target_states text[] default '{}',
  account_manager_id uuid references profiles(id),
  stage campaign_stage not null default 'audit_benchmark',
  health campaign_health not null default 'on_track',
  started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();

create table campaign_services (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  service_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  name text not null,
  expected_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'planned',
  client_visible boolean not null default true,
  internal_notes text, -- never exposed to client role, see RLS
  assigned_to uuid references profiles(id),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger tasks_set_updated_at before update on tasks
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- reports & metrics
-- ---------------------------------------------------------------------------
create table reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  month date not null, -- first of month
  executive_summary text,
  work_completed text,
  recommendations text,
  next_priorities text,
  pdf_url text,
  published_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table report_metrics (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  metric_key text not null, -- e.g. 'organic_traffic', 'keywords_improved'
  metric_label text not null,
  value numeric,
  value_text text,
  change_direction text, -- up | down | flat
  created_at timestamptz not null default now()
);

create table keyword_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  keyword text not null,
  position integer,
  previous_position integer,
  search_volume integer,
  recorded_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table traffic_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  organic_sessions integer,
  impressions integer,
  clicks integer,
  avg_position numeric,
  created_at timestamptz not null default now()
);

create table lead_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  leads_count integer,
  source text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- files, messaging, notifications, support
-- ---------------------------------------------------------------------------
create table files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  uploaded_by uuid references profiles(id),
  storage_path text not null, -- Supabase Storage object path, not a public URL
  file_name text not null,
  file_type text,
  file_size_bytes bigint,
  category text, -- report | content_draft | brand_asset | audit | screenshot | other
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  subject text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger conversations_set_updated_at before update on conversations
  for each row execute function set_updated_at();

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  attachment_file_id uuid references files(id),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  created_by uuid references profiles(id),
  category text not null,
  subject text not null,
  description text not null,
  attachment_file_id uuid references files(id),
  status ticket_status not null default 'open',
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger support_tickets_set_updated_at before update on support_tickets
  for each row execute function set_updated_at();

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  type text not null, -- report_published | task_requires_approval | payment_successful | ...
  title text not null,
  body text,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- onboarding
-- ---------------------------------------------------------------------------
create table onboarding_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true
);

create table onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  onboarding_item_id uuid not null references onboarding_items(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  response_value text,
  unique (organization_id, onboarding_item_id)
);

-- ---------------------------------------------------------------------------
-- activity log (audit trail)
-- ---------------------------------------------------------------------------
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  actor_id uuid references profiles(id),
  action text not null, -- subscription_activated | payment_confirmed | plan_changed | role_changed | ...
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes for the foreign keys / lookups that matter most
-- ---------------------------------------------------------------------------
create index on organization_members (user_id);
create index on organization_members (organization_id);
create index on websites (organization_id);
create index on subscriptions (organization_id);
create index on payments (organization_id);
create index on payments (subscription_id);
create index on projects (organization_id);
create index on tasks (project_id);
create index on reports (organization_id);
create index on files (organization_id);
create index on messages (conversation_id);
create index on conversations (organization_id);
create index on support_tickets (organization_id);
create index on notifications (user_id);
create index on activity_logs (organization_id);
