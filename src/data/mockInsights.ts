export interface KnowledgeItem {
  id: string;
  title: string;
  type: "reference" | "webinar" | "meeting";
  description?: string;
  link?: string;
  date?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "logo" | "color" | "font" | "document";
  value?: string; // hex, font name, etc.
  description?: string;
}

export const mockKnowledge: KnowledgeItem[] = [
  { id: "k1", title: "수경재배 시장 조사 2024", type: "reference", description: "국내외 시장 규모 및 트렌드", date: "2025-01-15" },
  { id: "k2", title: "웰니스 앱 사용자 리서치", type: "reference", description: "타깃 20–30대 인터뷰 요약", date: "2025-01-20" },
  { id: "k3", title: "스타트업 IR 웨비나 자료", type: "webinar", link: "#", date: "2025-02-01" },
  { id: "k4", title: "주간 킥오프 회의록 2/13", type: "meeting", description: "1/4/10 방향성 공유", date: "2025-02-13" },
  { id: "k5", title: "청년창업사관학교 가이드", type: "reference", link: "#", date: "2025-02-10" },
];

export const mockAssets: AssetItem[] = [
  { id: "a1", name: "STUDIO 010 로고", type: "logo", description: "메인 로고 (light/dark)" },
  { id: "a2", name: "Let's Comfy 로고", type: "logo", description: "B2C 브랜드 로고" },
  { id: "a3", name: "포인트 컬러", type: "color", value: "#00ff88", description: "STUDIO 010 그린" },
  { id: "a4", name: "보조 컬러", type: "color", value: "#0d0d0d", description: "배경 다크" },
  { id: "a5", name: "타이포", type: "font", value: "Pretendard, Space Grotesk", description: "본문 / 디스플레이" },
  { id: "a6", name: "IR 문서 2025.02", type: "document", description: "투자 유치용 최신 버전" },
];
