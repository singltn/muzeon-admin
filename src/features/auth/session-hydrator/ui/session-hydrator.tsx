"use client";

import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/entities/user/api/user-api";
import { userQueryKeys } from "@/entities/user/api/query-keys";
import { sessionActions } from "@/store/slices/session-slice";
import { permissionsActions } from "@/store/slices/permissions-slice";
import { useAppDispatch } from "@/store/hooks";
import type { Permission } from "@/shared/lib/rbac/types";

type MeResponse = Awaited<ReturnType<typeof userApi.me>> & {
  permissions?: Permission[];
};

export function SessionHydrator({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  const { data, isError, isLoading } = useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: () => userApi.me() as Promise<MeResponse>,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(sessionActions.setLoading());
      return;
    }
    if (isError || !data) {
      dispatch(sessionActions.setUnauthenticated());
      dispatch(permissionsActions.clearPermissions());
      return;
    }
    dispatch(sessionActions.setAuthenticated(data));
    if (data.permissions) {
      dispatch(permissionsActions.setPermissions(data.permissions));
    }
  }, [data, isError, isLoading, dispatch]);

  return <>{children}</>;
}
