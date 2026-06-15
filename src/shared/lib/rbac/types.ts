export type UserRole = "super_admin" | "museum_admin" | "museum_stuff";

export const ALL_ROLES: UserRole[] = ["super_admin", "museum_admin", "museum_stuff"];

/** Может управлять событиями и площадками */
export function isEventManager(role: UserRole): boolean {
  return role === "museum_admin" || role === "museum_stuff";
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "super_admin";
}

export function isMuseumAdmin(r: UserRole): boolean {
  return r === "museum_admin";
}

export function getDefaultRoute(role: UserRole): string {
  return "/dashboard";
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  museum_admin: "Администратор музея",
  museum_stuff: "Сотрудник музея",
};
