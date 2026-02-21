export interface KpiGoal {
  id: string;
  label: string;
}

export const mainKpiGoals: KpiGoal[] = [
  { id: "m1", label: "분기 매출 목표 달성" },
  { id: "m2", label: "신규 B2B 클라이언트 2건 확보" },
  { id: "m3", label: "Let's Comfy 펀딩 오픈" },
  { id: "m4", label: "팀 1/4/10 회의 정착" },
  { id: "m5", label: "IR 자료 최종본 확정" },
];

export const monthlyKpiGoals: KpiGoal[] = [
  { id: "mo1", label: "2월 예산 집행률 80% 이상" },
  { id: "mo2", label: "A사 프로젝트 1차 납품" },
  { id: "mo3", label: "와디즈 페이지 런칭" },
  { id: "mo4", label: "청년창업사관학교 제출" },
];

export const weeklyKpiGoals: KpiGoal[] = [
  { id: "w1", label: "주간 킥오프 회의 진행" },
  { id: "w2", label: "B사 영상 1차 수정본 전달" },
  { id: "w3", label: "Let's Comfy 로고 시안 확정" },
  { id: "w4", label: "시장 조사 자료 정리" },
  { id: "w5", label: "예산 현황 공유" },
];
