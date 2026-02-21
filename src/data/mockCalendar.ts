export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "meeting" | "milestone" | "deadline" | "regular";
  description?: string;
  allDay?: boolean;
}

export const mockEvents: CalendarEvent[] = [
  { id: "e1", title: "주간 킥오프", date: "2025-02-20", type: "meeting", description: "1/4/10 정기 회의" },
  { id: "e2", title: "와디즈 펀딩 오픈", date: "2025-02-25", type: "milestone", description: "Let's Comfy" },
  { id: "e3", title: "IR 자료 마감", date: "2025-02-22", type: "deadline", description: "투자 유치용" },
  { id: "e4", title: "A사 프레젠테이션", date: "2025-02-24", type: "meeting", description: "대면 미팅" },
  { id: "e5", title: "청년창업사관학교 제출", date: "2025-02-28", type: "deadline" },
  { id: "e6", title: "중간 점검 (4)", date: "2025-02-21", type: "meeting", description: "1/4/10 중간" },
  { id: "e7", title: "B사 영상 1차 납품", date: "2025-02-26", type: "deadline" },
];
