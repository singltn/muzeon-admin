export const eventQueryKeys = {
  all: ["events"] as const,
  list: (museumId: number, params?: object) =>
    [...eventQueryKeys.all, "list", museumId, params] as const,
  detail: (museumId: number, id: number) =>
    [...eventQueryKeys.all, "detail", museumId, id] as const,
};
