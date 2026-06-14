"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import { sessionActions } from "@/store/slices/session-slice";
import { useAppDispatch } from "@/store/hooks";
import { getDefaultRoute } from "@/shared/lib/rbac/types";
import { clearSessionMarker } from "@/shared/lib/session-marker";

export function SessionHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isError, isLoading } = useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: userApi.me,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(sessionActions.setLoading());
      return;
    }
    if (isError || !data) {
      clearSessionMarker();
      dispatch(sessionActions.setUnauthenticated());
      return;
    }
    dispatch(sessionActions.setAuthenticated(data));
  }, [data, isError, isLoading, dispatch]);

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

/** Хук для редиректа на default route роли */
export function useRoleRedirect() {
  const router = useRouter();
  return (role: string) => {
    router.replace(getDefaultRoute(role as Parameters<typeof getDefaultRoute>[0]));
  };
}
