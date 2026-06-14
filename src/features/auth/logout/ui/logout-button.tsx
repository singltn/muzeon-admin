"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);
    try {
      // Останавливаем все запросы и чистим стор ДО навигации
      await queryClient.cancelQueries();
      queryClient.clear();
      dispatch(sessionActions.clearSession());

      // POST /api/auth/logout:
      //  — вызывает бэкенд (best-effort)
      //  — удаляет session_marker cookie на сервере
      //  — возвращает redirect 307 → /login
      // Переходим туда напрямую — cookie уже удалена сервером,
      // middleware не увидит session_marker и не зациклится
      window.location.href = "/api/auth/logout";
    } catch {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </button>
  );
}
