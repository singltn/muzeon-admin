import type { UserRole } from "./types";

/** Проверяет, имеет ли роль доступ к набору разрешённых ролей */
export function can(role: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(role);
}
