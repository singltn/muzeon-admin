"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";
import { logoutApi } from "../api/logout-api";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);
    try {
      // Бэкенд сам удаляет session cookie через Set-Cookie в ответе
      await logoutApi.logout();
    } catch {
      // Даже если запрос упал — всё равно уходим на логин
    } finally {
      // Чистим клиентский стейт
      queryClient.cancelQueries();
      queryClient.clear();
      dispatch(sessionActions.clearSession());
      // Перезагрузка страницы: браузер применит Set-Cookie от бэкенда
      // (удаление session куки) до того как загрузится /login
      window.location.replace("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </button>
  );
}
