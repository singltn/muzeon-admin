"use client";

import { Menu, PanelLeft } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { uiActions } from "@/store/slices/ui-slice";
import { LogoutButton } from "@/features/auth/logout/ui/logout-button";
import { getUserDisplayName } from "@/entities/user/model/types";

export function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.session.user);
  const role = useAppSelector((s) => s.session.role);

  const museumName =
    role === "super_admin" ? "Платформа MUZEON" : (user?.museum?.name ?? "");

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
          onClick={() => dispatch(uiActions.toggleMobileSidebar())}
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop collapse */}
        <button
          className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
          onClick={() => dispatch(uiActions.toggleSidebar())}
          aria-label="Свернуть меню"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        {museumName && (
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            {museumName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <span className="hidden text-sm text-muted-foreground md:block">
            {getUserDisplayName(user)}
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
