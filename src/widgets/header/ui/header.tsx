"use client";

import { PanelLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { uiActions } from "@/store/slices/ui-slice";
import { useAppDispatch } from "@/store/hooks";
import { LogoutButton } from "@/features/auth/logout/ui/logout-button";
import { getUserDisplayName } from "@/entities/user/model/types";

export function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.session.user);
  const role = useAppSelector((s) => s.session.role);

  const museumName =
    role === "super_admin"
      ? "Платформа MUZEON"
      : (user?.museum?.name ?? "");

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => dispatch(uiActions.toggleSidebar())}
          aria-label="Переключить меню"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {museumName && (
          <span className="text-sm font-medium text-muted-foreground">
            {museumName}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="hidden text-sm text-muted-foreground sm:block">
            {getUserDisplayName(user)}
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
