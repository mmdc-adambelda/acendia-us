-- Acendia Client Portal — Row Level Security
-- This is the REAL security boundary (not app code, not middleware).
-- Run after 0001_schema.sql.

-- ---------------------------------------------------------------------------
-- Helper functions (security definer so they can read profiles/membership
-- regardless of the calling user's own RLS visibility into those tables)
-- ---------------------------------------------------------------------------
create or replace function current_user_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql security definer stable;

create or replace function is_staff_or_above()
returns boolean as $$
  select coalesce(current_user_role() in ('staff', 'admin', 'super_admin'), false);
$$ language sql security definer stable;

create or replace function is_admin_or_above()
returns boolean as $$
  select coalesce(current_user_role() in ('admin', 'super_admin'), false);
$$ language sql security definer stable;

create or replace function is_super_admin()
returns boolean as $$
  select coalesce(current_user_role() = 'super_admin', false);
$$ language sql security definer stable;

create or replace function is_org_member(org_id uuid)
returns boolean as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

create or replace function is_org_owner(org_id uuid)
returns boolean as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid() and role = 'owner'
  );
$$ language sql security definer stable;

-- Combined "can view this org's data" check used throughout: an org
-- member OR any staff-role-or-above user.
create or replace function can_access_org(org_id uuid)
returns boolean as $$
  select is_org_member(org_id) or is_staff_or_above();
$$ language sql security definer stable;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;

create policy "profiles_select_own_or_staff" on profiles
  for select using (id = auth.uid() or is_staff_or_above());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

-- Only admins can change roles/create staff profiles directly (client
-- self-registration goes through the handle_new_user() trigger, which
-- runs as security definer and bypasses this — see 0001_schema.sql).
create policy "profiles_admin_manage" on profiles
  for all using (is_admin_or_above());

-- ---------------------------------------------------------------------------
-- organizations
-- ---------------------------------------------------------------------------
alter table organizations enable row level security;

create policy "organizations_select" on organizations
  for select using (can_access_org(id));

create policy "organizations_update" on organizations
  for update using (is_org_owner(id) or is_staff_or_above());

create policy "organizations_insert_staff" on organizations
  for insert with check (true); -- created via server action after auth; app layer sets creator as owner immediately after

create policy "organizations_delete_admin" on organizations
  for delete using (is_admin_or_above());

-- ---------------------------------------------------------------------------
-- organization_members
-- ---------------------------------------------------------------------------
alter table organization_members enable row level security;

create policy "org_members_select" on organization_members
  for select using (can_access_org(organization_id));

create policy "org_members_manage" on organization_members
  for all using (is_org_owner(organization_id) or is_staff_or_above());

-- ---------------------------------------------------------------------------
-- websites / locations
-- ---------------------------------------------------------------------------
alter table websites enable row level security;
create policy "websites_select" on websites for select using (can_access_org(organization_id));
create policy "websites_write_owner_or_staff" on websites for all using (is_org_owner(organization_id) or is_staff_or_above());

alter table locations enable row level security;
create policy "locations_select" on locations for select using (can_access_org(organization_id));
create policy "locations_write_owner_or_staff" on locations for all using (is_org_owner(organization_id) or is_staff_or_above());

-- ---------------------------------------------------------------------------
-- plans — publicly readable (pricing page), admin-writable only
-- ---------------------------------------------------------------------------
alter table plans enable row level security;

create policy "plans_select_active_public" on plans
  for select using (is_active = true or is_staff_or_above());

create policy "plans_admin_manage" on plans
  for all using (is_admin_or_above());

-- ---------------------------------------------------------------------------
-- subscriptions / payments / invoices
-- ---------------------------------------------------------------------------
alter table subscriptions enable row level security;
create policy "subscriptions_select" on subscriptions for select using (can_access_org(organization_id));
create policy "subscriptions_write_staff" on subscriptions for all using (is_staff_or_above());

alter table payments enable row level security;
create policy "payments_select" on payments for select using (can_access_org(organization_id));
create policy "payments_write_staff" on payments for all using (is_staff_or_above());

alter table invoices enable row level security;
create policy "invoices_select" on invoices for select using (can_access_org(organization_id));
create policy "invoices_write_staff" on invoices for all using (is_staff_or_above());

-- payment_webhook_events: never readable/writable by client-authenticated
-- roles at all — only the admin client (service role, bypasses RLS) writes
-- these from webhook handlers. Staff can read for debugging.
alter table payment_webhook_events enable row level security;
create policy "webhook_events_staff_read" on payment_webhook_events
  for select using (is_staff_or_above());

-- ---------------------------------------------------------------------------
-- projects / campaign_services / milestones / tasks
-- ---------------------------------------------------------------------------
alter table projects enable row level security;
create policy "projects_select" on projects for select using (can_access_org(organization_id));
create policy "projects_write_staff" on projects for all using (is_staff_or_above());

alter table campaign_services enable row level security;
create policy "campaign_services_select" on campaign_services
  for select using (exists (select 1 from projects p where p.id = project_id and can_access_org(p.organization_id)));
create policy "campaign_services_write_staff" on campaign_services for all using (is_staff_or_above());

alter table milestones enable row level security;
create policy "milestones_select" on milestones
  for select using (exists (select 1 from projects p where p.id = project_id and can_access_org(p.organization_id)));
create policy "milestones_write_staff" on milestones for all using (is_staff_or_above());

-- tasks: clients only ever see client_visible = true rows; internal_notes
-- column exists but the app layer must not select it for client-role
-- requests — RLS controls row visibility, not per-column masking, so the
-- portal's data-fetching code must explicitly omit internal_notes for
-- client-facing queries (documented in CLIENT-PORTAL-IMPLEMENTATION.md).
alter table tasks enable row level security;
create policy "tasks_select_client" on tasks
  for select using (
    is_staff_or_above()
    or (client_visible = true and exists (
      select 1 from projects p where p.id = project_id and is_org_member(p.organization_id)
    ))
  );
create policy "tasks_write_staff" on tasks for all using (is_staff_or_above());

-- ---------------------------------------------------------------------------
-- reports & metrics
-- ---------------------------------------------------------------------------
alter table reports enable row level security;
create policy "reports_select_published" on reports
  for select using (
    is_staff_or_above()
    or (published_at is not null and can_access_org(organization_id))
  );
create policy "reports_write_staff" on reports for all using (is_staff_or_above());

alter table report_metrics enable row level security;
create policy "report_metrics_select" on report_metrics
  for select using (exists (
    select 1 from reports r where r.id = report_id
    and (is_staff_or_above() or (r.published_at is not null and can_access_org(r.organization_id)))
  ));
create policy "report_metrics_write_staff" on report_metrics for all using (is_staff_or_above());

alter table keyword_metrics enable row level security;
create policy "keyword_metrics_select" on keyword_metrics
  for select using (exists (select 1 from projects p where p.id = project_id and can_access_org(p.organization_id)));
create policy "keyword_metrics_write_staff" on keyword_metrics for all using (is_staff_or_above());

alter table traffic_metrics enable row level security;
create policy "traffic_metrics_select" on traffic_metrics
  for select using (exists (select 1 from projects p where p.id = project_id and can_access_org(p.organization_id)));
create policy "traffic_metrics_write_staff" on traffic_metrics for all using (is_staff_or_above());

alter table lead_metrics enable row level security;
create policy "lead_metrics_select" on lead_metrics
  for select using (exists (select 1 from projects p where p.id = project_id and can_access_org(p.organization_id)));
create policy "lead_metrics_write_staff" on lead_metrics for all using (is_staff_or_above());

-- ---------------------------------------------------------------------------
-- files
-- ---------------------------------------------------------------------------
alter table files enable row level security;
create policy "files_select" on files for select using (can_access_org(organization_id));
create policy "files_insert" on files for insert with check (can_access_org(organization_id));
create policy "files_delete" on files for delete using (is_staff_or_above() or uploaded_by = auth.uid());

-- ---------------------------------------------------------------------------
-- conversations / messages
-- ---------------------------------------------------------------------------
alter table conversations enable row level security;
create policy "conversations_select" on conversations for select using (can_access_org(organization_id));
create policy "conversations_insert" on conversations for insert with check (can_access_org(organization_id));

alter table messages enable row level security;
create policy "messages_select" on messages
  for select using (exists (select 1 from conversations c where c.id = conversation_id and can_access_org(c.organization_id)));
create policy "messages_insert" on messages
  for insert with check (
    sender_id = auth.uid()
    and exists (select 1 from conversations c where c.id = conversation_id and can_access_org(c.organization_id))
  );

-- ---------------------------------------------------------------------------
-- support_tickets
-- ---------------------------------------------------------------------------
alter table support_tickets enable row level security;
create policy "tickets_select" on support_tickets for select using (can_access_org(organization_id));
create policy "tickets_insert" on support_tickets for insert with check (can_access_org(organization_id));
create policy "tickets_update_staff_or_owner" on support_tickets
  for update using (is_staff_or_above() or created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- notifications — strictly per-user
-- ---------------------------------------------------------------------------
alter table notifications enable row level security;
create policy "notifications_select_own" on notifications for select using (user_id = auth.uid());
create policy "notifications_update_own" on notifications for update using (user_id = auth.uid());
create policy "notifications_insert_staff" on notifications for insert with check (is_staff_or_above());

-- ---------------------------------------------------------------------------
-- onboarding
-- ---------------------------------------------------------------------------
alter table onboarding_items enable row level security;
create policy "onboarding_items_select_all" on onboarding_items for select using (true);
create policy "onboarding_items_admin_manage" on onboarding_items for all using (is_admin_or_above());

alter table onboarding_responses enable row level security;
create policy "onboarding_responses_select" on onboarding_responses for select using (can_access_org(organization_id));
create policy "onboarding_responses_write" on onboarding_responses
  for all using (is_org_member(organization_id) or is_staff_or_above());

-- ---------------------------------------------------------------------------
-- activity_logs — staff+ read, super_admin oversight; app layer inserts
-- via the admin (service role) client so client-side code can never
-- forge audit entries.
-- ---------------------------------------------------------------------------
alter table activity_logs enable row level security;
create policy "activity_logs_select_staff" on activity_logs for select using (is_staff_or_above());
