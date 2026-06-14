export const userQueryKeys = {
  all: ["users"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
  list: (museumId: number, params?: object) =>
    [...userQueryKeys.all, "list", museumId, params] as const,
  detail: (museumId: number, userId: number) =>
    [...userQueryKeys.all, "detail", museumId, userId] as const,
};
