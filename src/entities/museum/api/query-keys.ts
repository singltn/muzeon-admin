export const museumQueryKeys = {
  all: ["museums"] as const,
  list: (params?: object) => [...museumQueryKeys.all, "list", params] as const,
  detail: (id: number) => [...museumQueryKeys.all, "detail", id] as const,
};
