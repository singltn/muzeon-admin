export const eventTypeQueryKeys = {
  all: ["event-types"] as const,
  list: () => [...eventTypeQueryKeys.all, "list"] as const,
  detail: (id: number) => [...eventTypeQueryKeys.all, "detail", id] as const,
};
