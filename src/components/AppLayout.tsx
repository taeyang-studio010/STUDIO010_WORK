"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileDrawer } from "@/components/MobileDrawer";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col min-w-0",
          "pl-0 pt-14 md:pt-0 md:pl-[72px] lg:pl-[240px]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
