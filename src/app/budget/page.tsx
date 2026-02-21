import { Sidebar } from "@/components/Sidebar";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BudgetTracker } from "@/components/BudgetTracker";

export default function BudgetPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col pl-[240px] max-lg:pl-[72px]">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 flex-col gap-6 overflow-auto p-6 lg:p-8">
            <header>
              <h1 className="text-2xl font-semibold text-white">
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
      </main>
    </div>
  );
}
