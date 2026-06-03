export const userQueryKeys = {
  all: ["users"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
  list: (filters: { page?: number; search?: string }) =>
    [...userQueryKeys.all, "list", filters] as const,
};
