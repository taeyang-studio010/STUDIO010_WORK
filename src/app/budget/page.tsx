import { AppLayout } from "@/components/AppLayout";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BudgetTracker } from "@/components/BudgetTracker";

export default function BudgetPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 overflow-auto p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              010 MONEY
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              프로젝트별 가용 예산, 지출, 정부지원금 소진율
            </p>
          </header>
          <BudgetTracker />
        </div>
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
