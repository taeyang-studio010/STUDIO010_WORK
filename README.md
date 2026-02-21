# STUDIO 010 협업 워크스페이스

Track A (STUDIO 010) & Track B (Let's Comfy) 통합 협업 허브입니다.

## 실행 방법

1. 프로젝트로 이동
   ```bash
   cd studio-010-workspace
   ```
2. 의존성 설치
   ```bash
   npm install
   ```
3. 환경변수 설정 (`.env.local`)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
4. (선택) RLS 적용: 로그인한 사용자가 데이터를 쓰려면 마이그레이션 적용
   ```bash
   npm run supabase:db:push
   ```
   - `002_authenticated_rls.sql`: 로그인한 사용자도 작업/캘린더/예산/인사이트 CRUD 가능
5. 개발 서버 실행
   ```bash
   npm run dev
   ```
6. 브라우저 접속: [http://localhost:3000](http://localhost:3000)
   - 미로그인 시 `/login`으로 리다이렉트됩니다. 회원가입(`/signup`) 후 로그인하면 됩니다.

## Supabase 적용

### A) 로컬 Supabase (Docker 필요)

```bash
npm run supabase:start
npm run supabase:db:reset
```

- 현재 마이그레이션: `supabase/migrations/001_init.sql`
- 현재 시드: `supabase/seed.sql`
- 로컬 스택 종료:

```bash
npm run supabase:stop
```

### B) 원격 Supabase 프로젝트

Supabase CLI 로그인/링크 후 마이그레이션 반영:

```bash
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
npm run supabase:db:push
```

> `exec-invite` API를 사용하려면 `SUPABASE_SERVICE_ROLE_KEY`가 반드시 필요합니다.

## 구현된 협업 기능

- **인증**: 로그인/회원가입/로그아웃, 미들웨어로 보호 구간 리다이렉트, Auth 콜백
- Supabase 클라이언트/서버 유틸 + 환경변수 가드
- 전체 도메인 DB 스키마 + RLS + 시드 (로그인 사용자 RLS: `002_authenticated_rls.sql`)
- KPI/칸반/인박스 실시간 전환
- 캘린더/스토리지/예산 실시간 전환
- **작업(010 SHARE)**: 작업 추가·수정 모달, 칸반 드래그/상태 변경
- **캘린더(010 CALENDAR)**: 일정 추가·수정·삭제 모달
- **예산(010 MONEY)**: 프로젝트 추가·수정, 지출 등록 모달
- **인사이트(010 STORAGE)**: 지식/에셋 추가·수정 모달
- **010 NOW**: KPI 항목 추가·편집·삭제, 1/4/10 위젯 추가·편집, 팀 상태 추가·편집, 인박스 요청 편집
- **010 TALK**: 팀 채팅 (실시간 메시지)
- 임원 초대 API + 감사 로그 기반 액티비티 피드

## 기술 스택

- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS
- Backend/DB/Auth/Realtime: Supabase

## 폴더 구조

- `src/app/` - 페이지 및 API 라우트
- `src/components/` - UI 컴포넌트
- `src/features/` - 도메인 훅/데이터 레이어
- `src/lib/` - 공통 유틸/Supabase/Realtime
- `supabase/migrations/` - DB 마이그레이션
