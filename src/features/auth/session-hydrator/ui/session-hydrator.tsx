"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";

export function SessionHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  const { data, isError, isLoading } = useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: userApi.me,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(sessionActions.setLoading());
      return;
    }
    if (isError || !data) {
      dispatch(sessionActions.setUnauthenticated());
      // 401 от бэкенда — сессия истекла, уходим на логин
      // window.location чтобы middleware пересчитал куки заново
      window.location.replace("/login");
      return;
    }
    dispatch(sessionActions.setAuthenticated(data));
  }, [data, isError, isLoading, dispatch]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
