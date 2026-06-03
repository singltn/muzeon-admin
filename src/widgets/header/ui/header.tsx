"use client";

import { Bell, PanelLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { uiActions } from "@/store/slices/ui-slice";
import { useAppDispatch } from "@/store/hooks";
import { LogoutButton } from "@/features/auth/logout/ui/logout-button";
import { Button } from "@/shared/ui/button";

export function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.session.user);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(uiActions.toggleSidebar())}
        aria-label="Переключить меню"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Уведомления">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </Button>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {user?.displayName ?? user?.email ?? "Гость"}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
