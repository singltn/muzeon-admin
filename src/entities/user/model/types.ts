import type { Role } from "@/shared/lib/rbac/types";

export type User = {
  id: string;
  email: string;
  displayName: string;
  roles: Role[];
  avatarUrl?: string;
};
