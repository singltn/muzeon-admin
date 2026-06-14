export const locationQueryKeys = {
  all: ["locations"] as const,
  list: (museumId: number, params?: object) =>
    [...locationQueryKeys.all, "list", museumId, params] as const,
  detail: (museumId: number, id: number) =>
    [...locationQueryKeys.all, "detail", museumId, id] as const,
};
