import type { UserRole } from "@/shared/lib/rbac/types";

export type MuseumRef = {
  id: number;
  name: string;
  status: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  museum: MuseumRef | null;
  created_at: string;
  updated_at: string;
};

export function getUserDisplayName(user: User): string {
  const full = `${user.first_name} ${user.last_name}`.trim();
  return full || user.email;
}

export type AdminUserCreate = {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
};

export type AdminUserUpdate = {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
};
