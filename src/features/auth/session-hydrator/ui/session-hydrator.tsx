"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";

export function SessionHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      // Истёкшая сессия — уходим на логин через серверный route
      // (он удалит session_marker и сделает redirect)
      router.replace("/api/auth/logout");
      return;
    }
    dispatch(sessionActions.setAuthenticated(data));
  }, [data, isError, isLoading, dispatch, router]);

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
