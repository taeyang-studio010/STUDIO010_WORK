-- KPI: 로그인 사용자도 추가/수정 가능 (이미 있으면 제거 후 생성)
drop policy if exists "kpi_sets_authenticated_rw" on public.kpi_sets;
create policy "kpi_sets_authenticated_rw"
on public.kpi_sets for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "kpi_items_authenticated_rw" on public.kpi_items;
create policy "kpi_items_authenticated_rw"
on public.kpi_items for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- 1/4/10 편집용
create table if not exists public.one_four_ten (
  id uuid primary key default gen_random_uuid(),
  step text not null,
  title text not null,
  description text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.one_four_ten enable row level security;
drop policy if exists "one_four_ten_authenticated_rw" on public.one_four_ten;
create policy "one_four_ten_authenticated_rw"
on public.one_four_ten for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- 팀 상태 편집용
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  status text default '업무중',
  location text default '사무실',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
drop policy if exists "team_members_authenticated_rw" on public.team_members;
create policy "team_members_authenticated_rw"
on public.team_members for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- 010 TALK 채팅
create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null default '일반',
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_rooms enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_rooms_authenticated_rw" on public.chat_rooms;
create policy "chat_rooms_authenticated_rw"
on public.chat_rooms for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "chat_messages_authenticated_rw" on public.chat_messages;
create policy "chat_messages_authenticated_rw"
on public.chat_messages for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- 기본 채팅방 1개
insert into public.chat_rooms (id, name)
select '00000000-0000-0000-0000-000000000001', '일반'
where not exists (select 1 from public.chat_rooms limit 1);

-- 1/4/10 기본 데이터 (없을 때만)
insert into public.one_four_ten (step, title, description, position)
select * from (values
  ('1'::text, '방향성'::text, '이번 주 업무 방향 공유'::text, 0),
  ('4'::text, '중간점검'::text, '진행 현황 점검'::text, 1),
  ('10'::text, '결과 & 피드백'::text, '정기 회의 및 피드백'::text, 2)
) as v(step, title, description, position)
where not exists (select 1 from public.one_four_ten limit 1);
