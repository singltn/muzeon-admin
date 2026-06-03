import type { Permission, RbacContext } from "./types";

export function can(
  ctx: RbacContext,
  permission: Permission,
): boolean {
  return ctx.permissions.includes(permission);
}

export function canAny(
  ctx: RbacContext,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => can(ctx, p));
}

export function canAll(
  ctx: RbacContext,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => can(ctx, p));
}
