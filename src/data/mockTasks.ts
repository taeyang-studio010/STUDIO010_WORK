import type { Task, InboxRequest } from "@/types/task";

export const initialTasks: Task[] = [
  { id: "1", track: "letscomfy", title: "Let's Comfy 로고 시안 2안", status: "review", assignee: "지희", createdAt: "2025-02-18" },
  { id: "2", track: "letscomfy", title: "와디즈 펀딩 페이지 카피", status: "in_progress", assignee: "태양", createdAt: "2025-02-17" },
  { id: "3", track: "letscomfy", title: "앱 UI 키 화면 와이어프레임", status: "todo", assignee: "지희", createdAt: "2025-02-16" },
  { id: "4", track: "studio010", title: "A사 브랜드 가이드 최종 수정", status: "done", assignee: "지희", createdAt: "2025-02-15" },
  { id: "5", track: "studio010", title: "B사 영상 편집 1차", status: "in_progress", assignee: "성기", createdAt: "2025-02-16" },
  { id: "6", track: "studio010", title: "IR 자료 3월 버전 업데이트", status: "todo", assignee: "해인", createdAt: "2025-02-14" },
];

export const initialInbox: InboxRequest[] = [
  { id: "r1", from: "태양", to: "지희", title: "에셋 요청: 로고 psd", message: "발표용 고해상도 버전 필요해요", status: "accepted", createdAt: "2025-02-19T10:00:00" },
  { id: "r2", from: "해인", to: "성기", title: "공간 촬영 지원", message: "다음 주 화요일 오후 가능할까요?", status: "accepted", createdAt: "2025-02-19T09:30:00" },
  { id: "r3", from: "성기", to: "태양", title: "회의실 예약 확인", message: "목요일 2시 회의실 사용 가능 여부", status: "pending", createdAt: "2025-02-20T11:00:00" },
];
