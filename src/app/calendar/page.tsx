import { Sidebar } from "@/components/Sidebar";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CalendarView } from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col pl-[240px] max-lg:pl-[72px]">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 flex-col gap-6 overflow-auto p-6 lg:p-8">
            <header>
              <h1 className="text-2xl font-semibold text-white">010 CALENDAR</h1>
              <p className="mt-1 text-sm text-text-secondary">
                주간 회의, 마일스톤, 개인 마감일
              </p>
            </header>
            <CalendarView />
          </div>
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
