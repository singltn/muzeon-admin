"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { logoutApi } from "../api/logout-api";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";
import { clearSessionMarker } from "@/shared/lib/session-marker";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logoutApi.logout,
    onSettled: () => {
      clearSessionMarker();
      dispatch(sessionActions.clearSession());
      // Останавливаем все текущие запросы до очистки кэша,
      // иначе queryClient.clear() запускает повторный fetch → гонка
      queryClient.cancelQueries();
      queryClient.clear();
      // Hard-navigation полностью уничтожает React-дерево (включая SessionHydrator),
      // исключая любые гонки между router.push и рефетчем
      window.location.replace("/login");
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      Выйти
    </button>
  );
}
