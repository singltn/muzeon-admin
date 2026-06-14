export type UserRole =
  | "super_admin"
  | "museum_admin"
  | "content"
  | "marketer"
  | "analyst";

/** EventReader роли */
export const EVENT_READER_ROLES: UserRole[] = [
  "super_admin",
  "museum_admin",
  "content",
  "marketer",
  "analyst",
];

/** EventManager роли */
export const EVENT_MANAGER_ROLES: UserRole[] = [
  "super_admin",
  "museum_admin",
  "content",
];

export function isEventManager(role: UserRole): boolean {
  return EVENT_MANAGER_ROLES.includes(role);
}

export function isEventReader(role: UserRole): boolean {
  return EVENT_READER_ROLES.includes(role);
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === "super_admin";
}

export function isMuseumAdmin(role: UserRole): boolean {
  return role === "museum_admin";
}

export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case "super_admin":
      return "/museums";
    case "museum_admin":
      return "/museum";
    default:
      return "/events";
  }
}
