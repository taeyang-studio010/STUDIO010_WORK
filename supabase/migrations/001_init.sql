create extension if not exists pgcrypto;

create type public.kpi_scope as enum ('main', 'monthly', 'weekly');
create type public.task_status as enum ('todo', 'in_progress', 'review', 'done');
create type public.track_id as enum ('studio010', 'letscomfy');
create type public.inbox_status as enum ('pending', 'accepted', 'rejected');
create type public.calendar_type as enum ('meeting', 'milestone', 'deadline', 'regular');
create type public.knowledge_type as enum ('reference', 'webinar', 'meeting');
create type public.asset_type as enum ('logo', 'color', 'font', 'document');
create type public.exec_invite_status as enum ('pending', 'accepted', 'expired', 'cancelled');
create type public.audit_action as enum ('insert', 'update', 'delete');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  role text,
  is_exec boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_exec_user(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid and p.is_exec = true
  );
$$;

create table public.kpi_sets (
  id uuid primary key default gen_random_uuid(),
  scope public.kpi_scope not null unique,
  title text not null,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kpi_items (
  id uuid primary key default gen_random_uuid(),
  kpi_set_id uuid not null references public.kpi_sets(id) on delete cascade,
  label text not null,
  checked boolean not null default false,
  position int not null default 0,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  track public.track_id not null,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  assignee text,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  body text not null,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inbox_requests (
  id uuid primary key default gen_random_uuid(),
  from_name text not null,
  to_name text not null,
  title text not null,
  message text,
  status public.inbox_status not null default 'pending',
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  type public.calendar_type not null default 'regular',
  description text,
  all_day boolean not null default true,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.knowledge_type not null,
  description text,
  link text,
  date date,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.asset_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.asset_type not null,
  value text,
  description text,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budget_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  total bigint not null check (total >= 0),
  spent bigint not null default 0 check (spent >= 0),
  is_government boolean not null default false,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budget_entries (
  id uuid primary key default gen_random_uuid(),
  budget_project_id uuid not null references public.budget_projects(id) on delete cascade,
  amount bigint not null,
  note text,
  spent_at date not null default now()::date,
  created_by uuid,
  updated_by uuid,
  last_updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exec_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text,
  invited_by uuid,
  invited_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  status public.exec_invite_status not null default 'pending',
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  row_id text,
  action public.audit_action not null,
  actor_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, is_exec)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'member'),
    coalesce((new.raw_user_meta_data ->> 'is_exec')::boolean, false)
  )
  on conflict (id) do update
  set email = excluded.email,
      name = coalesce(excluded.name, public.profiles.name),
      role = coalesce(excluded.role, public.profiles.role),
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_row_metadata()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at = coalesce(new.created_at, now());
    new.updated_at = now();
    new.last_updated_at = now();
    new.created_by = coalesce(new.created_by, auth.uid());
    new.updated_by = coalesce(new.updated_by, auth.uid());
  else
    new.updated_at = now();
    new.last_updated_at = now();
    new.updated_by = coalesce(auth.uid(), new.updated_by);
  end if;
  return new;
end;
$$;

create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_touch
before update on public.profiles
for each row execute function public.touch_profile_updated_at();

create or replace function public.log_audit_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id text;
begin
  target_id = coalesce((to_jsonb(new)->>'id'), (to_jsonb(old)->>'id'));

  insert into public.audit_logs (
    table_name,
    row_id,
    action,
    actor_id,
    before_data,
    after_data
  ) values (
    tg_table_name,
    target_id,
    lower(tg_op)::public.audit_action,
    auth.uid(),
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger trg_kpi_sets_touch
before insert or update on public.kpi_sets
for each row execute function public.touch_row_metadata();
create trigger trg_kpi_items_touch
before insert or update on public.kpi_items
for each row execute function public.touch_row_metadata();
create trigger trg_tasks_touch
before insert or update on public.tasks
for each row execute function public.touch_row_metadata();
create trigger trg_task_comments_touch
before insert or update on public.task_comments
for each row execute function public.touch_row_metadata();
create trigger trg_inbox_requests_touch
before insert or update on public.inbox_requests
for each row execute function public.touch_row_metadata();
create trigger trg_calendar_events_touch
before insert or update on public.calendar_events
for each row execute function public.touch_row_metadata();
create trigger trg_knowledge_items_touch
before insert or update on public.knowledge_items
for each row execute function public.touch_row_metadata();
create trigger trg_asset_items_touch
before insert or update on public.asset_items
for each row execute function public.touch_row_metadata();
create trigger trg_budget_projects_touch
before insert or update on public.budget_projects
for each row execute function public.touch_row_metadata();
create trigger trg_budget_entries_touch
before insert or update on public.budget_entries
for each row execute function public.touch_row_metadata();

create trigger trg_kpi_sets_audit
after insert or update or delete on public.kpi_sets
for each row execute function public.log_audit_change();
create trigger trg_kpi_items_audit
after insert or update or delete on public.kpi_items
for each row execute function public.log_audit_change();
create trigger trg_tasks_audit
after insert or update or delete on public.tasks
for each row execute function public.log_audit_change();
create trigger trg_task_comments_audit
after insert or update or delete on public.task_comments
for each row execute function public.log_audit_change();
create trigger trg_inbox_requests_audit
after insert or update or delete on public.inbox_requests
for each row execute function public.log_audit_change();
create trigger trg_calendar_events_audit
after insert or update or delete on public.calendar_events
for each row execute function public.log_audit_change();
create trigger trg_knowledge_items_audit
after insert or update or delete on public.knowledge_items
for each row execute function public.log_audit_change();
create trigger trg_asset_items_audit
after insert or update or delete on public.asset_items
for each row execute function public.log_audit_change();
create trigger trg_budget_projects_audit
after insert or update or delete on public.budget_projects
for each row execute function public.log_audit_change();
create trigger trg_budget_entries_audit
after insert or update or delete on public.budget_entries
for each row execute function public.log_audit_change();
create trigger trg_exec_invites_audit
after insert or update or delete on public.exec_invites
for each row execute function public.log_audit_change();

alter table public.profiles enable row level security;
alter table public.kpi_sets enable row level security;
alter table public.kpi_items enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.inbox_requests enable row level security;
alter table public.calendar_events enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.asset_items enable row level security;
alter table public.budget_projects enable row level security;
alter table public.budget_entries enable row level security;
alter table public.exec_invites enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_self_or_exec"
on public.profiles for select
using (auth.uid() = id or public.is_exec_user(auth.uid()));

create policy "profiles_update_self_or_exec"
on public.profiles for update
using (auth.uid() = id or public.is_exec_user(auth.uid()))
with check (auth.uid() = id or public.is_exec_user(auth.uid()));

create policy "profiles_insert_exec_only"
on public.profiles for insert
with check (public.is_exec_user(auth.uid()));

create policy "profiles_delete_exec_only"
on public.profiles for delete
using (public.is_exec_user(auth.uid()));

create policy "kpi_sets_exec_rw"
on public.kpi_sets for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "kpi_items_exec_rw"
on public.kpi_items for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "tasks_exec_rw"
on public.tasks for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "task_comments_exec_rw"
on public.task_comments for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "inbox_requests_exec_rw"
on public.inbox_requests for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "calendar_events_exec_rw"
on public.calendar_events for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "knowledge_items_exec_rw"
on public.knowledge_items for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "asset_items_exec_rw"
on public.asset_items for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "budget_projects_exec_rw"
on public.budget_projects for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "budget_entries_exec_rw"
on public.budget_entries for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "exec_invites_exec_rw"
on public.exec_invites for all
using (public.is_exec_user(auth.uid()))
with check (public.is_exec_user(auth.uid()));

create policy "audit_logs_exec_read_only"
on public.audit_logs for select
using (public.is_exec_user(auth.uid()));
