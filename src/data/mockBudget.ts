export interface BudgetProject {
  id: string;
  name: string;
  total: number;
  spent: number;
  isGovernment?: boolean; // 정부지원금 여부
}

export const mockBudget: BudgetProject[] = [
  { id: "b1", name: "STUDIO 010 운영", total: 50000000, spent: 12000000, isGovernment: false },
  { id: "b2", name: "Let's Comfy 프로젝트", total: 30000000, spent: 8000000, isGovernment: false },
  { id: "b3", name: "청년창업사관학교 지원금", total: 15000000, spent: 4500000, isGovernment: true },
];
