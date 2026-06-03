"use client";

import { Sidebar } from "@/widgets/sidebar/ui/sidebar";
import { Header } from "@/widgets/header/ui/header";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/shared/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} />
      <div className={cn("flex flex-1 flex-col", collapsed ? "ml-16" : "ml-64")}>
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
