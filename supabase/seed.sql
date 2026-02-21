-- Optional sample data for local/dev projects.
-- Profiles are examples only; in production they are created from auth.users trigger.
insert into public.profiles (id, email, name, role, is_exec)
values
  ('00000000-0000-0000-0000-000000000001', 'taeyang@studio010.kr', '태양', '대표', true),
  ('00000000-0000-0000-0000-000000000002', 'jihee@studio010.kr', '지희', '기획', true),
  ('00000000-0000-0000-0000-000000000003', 'haein@studio010.kr', '해인', '운영', true),
  ('00000000-0000-0000-0000-000000000004', 'sungki@studio010.kr', '성기', '제작', true)
on conflict (id) do nothing;

with sets as (
  insert into public.kpi_sets (scope, title, created_by, updated_by)
  values
    ('main', '메인 KPI', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
    ('monthly', '월간 KPI', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
    ('weekly', '주간 KPI', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001')
  on conflict (scope) do update set title = excluded.title
  returning id, scope
)
insert into public.kpi_items (kpi_set_id, label, checked, position, created_by, updated_by)
select s.id, v.label, v.checked, v.position, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'
from sets s
join (
  values
    ('main'::public.kpi_scope, '분기 매출 목표 달성', false, 0),
    ('main'::public.kpi_scope, '신규 B2B 클라이언트 2건 확보', false, 1),
    ('main'::public.kpi_scope, 'Let''s Comfy 펀딩 오픈', false, 2),
    ('main'::public.kpi_scope, '팀 1/4/10 회의 정착', false, 3),
    ('main'::public.kpi_scope, 'IR 자료 최종본 확정', false, 4),
    ('monthly'::public.kpi_scope, '2월 예산 집행률 80% 이상', false, 0),
    ('monthly'::public.kpi_scope, 'A사 프로젝트 1차 납품', false, 1),
    ('monthly'::public.kpi_scope, '와디즈 페이지 런칭', false, 2),
    ('monthly'::public.kpi_scope, '청년창업사관학교 제출', false, 3),
    ('weekly'::public.kpi_scope, '주간 킥오프 회의 진행', false, 0),
    ('weekly'::public.kpi_scope, 'B사 영상 1차 수정본 전달', false, 1),
    ('weekly'::public.kpi_scope, 'Let''s Comfy 로고 시안 확정', false, 2),
    ('weekly'::public.kpi_scope, '시장 조사 자료 정리', false, 3),
    ('weekly'::public.kpi_scope, '예산 현황 공유', false, 4)
) as v(scope, label, checked, position)
on s.scope = v.scope;

insert into public.tasks (track, title, status, assignee, created_by, updated_by)
values
  ('letscomfy', 'Let''s Comfy 로고 시안 2안', 'review', '지희', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('letscomfy', '와디즈 펀딩 페이지 카피', 'in_progress', '태양', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('letscomfy', '앱 UI 키 화면 와이어프레임', 'todo', '지희', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('studio010', 'A사 브랜드 가이드 최종 수정', 'done', '지희', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('studio010', 'B사 영상 편집 1차', 'in_progress', '성기', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004'),
  ('studio010', 'IR 자료 3월 버전 업데이트', 'todo', '해인', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003');

insert into public.inbox_requests (from_name, to_name, title, message, status, created_by, updated_by)
values
  ('태양', '지희', '에셋 요청: 로고 psd', '발표용 고해상도 버전 필요해요', 'accepted', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('해인', '성기', '공간 촬영 지원', '다음 주 화요일 오후 가능할까요?', 'accepted', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'),
  ('성기', '태양', '회의실 예약 확인', '목요일 2시 회의실 사용 가능 여부', 'pending', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001');

insert into public.calendar_events (title, date, type, description, created_by, updated_by)
values
  ('주간 킥오프', '2025-02-20', 'meeting', '1/4/10 정기 회의', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('와디즈 펀딩 오픈', '2025-02-25', 'milestone', 'Let''s Comfy', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('IR 자료 마감', '2025-02-22', 'deadline', '투자 유치용', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('A사 프레젠테이션', '2025-02-24', 'meeting', '대면 미팅', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

insert into public.knowledge_items (title, type, description, date, created_by, updated_by)
values
  ('수경재배 시장 조사 2024', 'reference', '국내외 시장 규모 및 트렌드', '2025-01-15', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
  ('웰니스 앱 사용자 리서치', 'reference', '타깃 20-30대 인터뷰 요약', '2025-01-20', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
  ('스타트업 IR 웨비나 자료', 'webinar', null, '2025-02-01', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

insert into public.asset_items (name, type, value, description, created_by, updated_by)
values
  ('STUDIO 010 로고', 'logo', null, '메인 로고 (light/dark)', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('포인트 컬러', 'color', '#00ff88', 'STUDIO 010 그린', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
  ('IR 문서 2025.02', 'document', null, '투자 유치용 최신 버전', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');

insert into public.budget_projects (name, total, spent, is_government, created_by, updated_by)
values
  ('STUDIO 010 운영', 50000000, 12000000, false, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('Let''s Comfy 프로젝트', 30000000, 8000000, false, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001'),
  ('청년창업사관학교 지원금', 15000000, 4500000, true, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001');
