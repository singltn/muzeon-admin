"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutApi } from "../api/logout-api";
import { sessionActions } from "@/store/slices/session-slice";
import { permissionsActions } from "@/store/slices/permissions-slice";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/shared/ui/button";

export function LogoutButton() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: logoutApi.logout,
    onSettled: () => {
      dispatch(sessionActions.clearSession());
      dispatch(permissionsActions.clearPermissions());
      queryClient.clear();
      router.push("/login");
    },
  });

  return (
    <Button variant="ghost" size="sm" onClick={() => mutation.mutate()}>
      Выйти
    </Button>
  );
}
