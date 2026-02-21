import { AppLayout } from "@/components/AppLayout";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ChatView } from "@/components/ChatView";

export default function TalkPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-1 flex-col gap-4 sm:gap-6 overflow-hidden p-4 sm:p-6 lg:p-8">
          <header className="shrink-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">010 TALK</h1>
            <p className="mt-1 text-sm text-text-secondary">팀 채팅</p>
          </header>
          <ChatView />
        </div>
        <ActivityFeed />
      </div>
    </AppLayout>
  );
}
