/** Role slug from backend — extend when product defines roles */
export type Role = string;

/**
 * Permission string: `resource:action`
 * Examples: exhibitions:read, exhibitions:write, users:manage
 */
export type Permission = `${string}:${string}`;

export type RbacContext = {
  roles: Role[];
  permissions: Permission[];
};
