"use client";

import { Sidebar } from "@/widgets/sidebar/ui/sidebar";
import { Header } from "@/widgets/header/ui/header";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/shared/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar collapsed={collapsed} />

      {/* On mobile: full width (no sidebar offset). On lg+: offset matches sidebar */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          collapsed ? "lg:ml-16" : "lg:ml-60",
        )}
      >
        <Header />
        {/* Prevent content from overflowing on narrow screens */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
