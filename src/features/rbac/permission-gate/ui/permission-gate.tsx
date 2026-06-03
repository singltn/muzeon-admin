"use client";

import type { ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { can, canAll, canAny } from "@/shared/lib/rbac/can";
import type { Permission } from "@/shared/lib/rbac/types";

type Props = {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
};

export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: Props) {
  const user = useAppSelector((s) => s.session.user);
  const permissions = useAppSelector((s) => s.permissions.granted);

  if (!user) return fallback;

  const ctx = { roles: user.roles, permissions };

  const allowed =
    (permission && can(ctx, permission)) ||
    (anyOf && canAny(ctx, anyOf)) ||
    (allOf && canAll(ctx, allOf)) ||
    (!permission && !anyOf && !allOf);

  return allowed ? children : fallback;
}
