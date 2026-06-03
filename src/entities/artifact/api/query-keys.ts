export const artifactQueryKeys = {
  all: ["artifacts"] as const,
  lists: () => [...artifactQueryKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...artifactQueryKeys.lists(), filters] as const,
  detail: (id: string) => [...artifactQueryKeys.all, "detail", id] as const,
};
