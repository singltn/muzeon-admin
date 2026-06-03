export const exhibitionQueryKeys = {
  all: ["exhibitions"] as const,
  lists: () => [...exhibitionQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...exhibitionQueryKeys.lists(), filters] as const,
  details: () => [...exhibitionQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...exhibitionQueryKeys.details(), id] as const,
};
