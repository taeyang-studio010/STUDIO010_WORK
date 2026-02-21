import { AppLayout } from "@/components/AppLayout";
import { ActivityFeed } from "@/components/ActivityFeed";
import { KanbanBoard } from "@/components/KanbanBoard";

export default function TasksPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 flex-col gap-6 sm:gap-8 overflow-auto p-4 sm:p-6 lg:p-8">
          <header>
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              010 SHARE
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              듀얼 트랙 칸반
            </p>
          </header>

          <KanbanBoard />
        </div>
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
