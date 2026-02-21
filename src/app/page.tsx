import { Sidebar } from "@/components/Sidebar";
import { KpiBlock } from "@/components/KpiBlock";
import { TeamStatusWidget } from "@/components/TeamStatusWidget";
import { OneFourTenWidget } from "@/components/OneFourTenWidget";
import { BudgetSummaryWidget } from "@/components/BudgetSummaryWidget";
import { TaskSummaryWidget } from "@/components/TaskSummaryWidget";
import { InboxPanel } from "@/components/InboxPanel";
import { ActivityFeed } from "@/components/ActivityFeed";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex min-h-screen flex-1 flex-col pl-[240px] max-lg:pl-[72px]">
        <div className="flex flex-1 min-h-0">
          <div className="flex w-full max-w-full flex-1 flex-col min-w-0 p-6 lg:p-8">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                010 NOW
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                STUDIO 010 · Let&apos;s Comfy 통합 협업 허브
              </p>
            </header>

            {/* KPI 1x3: 메인 | 월간 | 주간 한 줄 */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="min-w-0">
                <KpiBlock
                  title="메인 KPI"
                  scope="main"
                />
              </div>
              <div className="min-w-0">
                <KpiBlock
                  title="월간 KPI"
                  scope="monthly"
                />
              </div>
              <div className="min-w-0">
                <KpiBlock
                  title="주간 KPI"
                  scope="weekly"
                />
              </div>
            </div>

            {/* 1/4/10 + 2x2: 동일 너비 보장 (아래 4개 박스 좁아짐 방지) */}
            <div className="w-full min-w-0">
              <div className="mb-6 w-full">
                <OneFourTenWidget />
              </div>
              {/* 하단 2x2: 상단과 같은 폭, 50:50 열 */}
              <div
                className="grid w-full min-w-0 gap-6"
                style={{
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gridTemplateRows: "auto auto",
                  alignContent: "stretch",
                }}
              >
              <section className="flex min-h-0 min-w-0 [align-self:stretch]">
                <TeamStatusWidget />
              </section>
              <section className="flex min-h-0 min-w-0 [align-self:stretch]">
                <TaskSummaryWidget />
              </section>
              <section className="flex min-h-0 min-w-0 [align-self:stretch]">
                <InboxPanel />
              </section>
              <section className="flex min-h-0 min-w-0 [align-self:stretch]">
                <BudgetSummaryWidget />
              </section>
              </div>
            </div>
          </div>

          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}
