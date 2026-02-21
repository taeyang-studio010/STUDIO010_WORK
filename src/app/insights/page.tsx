import { AppLayout } from "@/components/AppLayout";
import { ActivityFeed } from "@/components/ActivityFeed";
import { InsightsHub } from "@/components/InsightsHub";

export default function InsightsPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 overflow-auto p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              010 STORAGE
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              시장 조사, 회의록, 로고·컬러·폰트·IR 문서
            </p>
          </header>
          <InsightsHub />
        </div>
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
