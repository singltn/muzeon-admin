"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { can } from "@/shared/lib/rbac/can";
import type { UserRole } from "@/shared/lib/rbac/types";

type Props = {
  roles: UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
};

export function PermissionGate({ roles, fallback = null, children }: Props) {
  const role = useAppSelector((s) => s.session.role);

  if (!role) return <>{fallback}</>;

  return can(role, roles) ? <>{children}</> : <>{fallback}</>;
}
