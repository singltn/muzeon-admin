import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { ApiError } from "./http-client";

function isAuthError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return (
    error.status === 401 ||
    error.code === "AUTH_REQUIRED" ||
    error.code === "SESSION_EXPIRED"
  );
}

function handleAuthError() {
  // Hard-redirect — бэкенд уже убил сессию, просто уходим на логин
  window.location.replace("/login");
}

export function getQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError(error) {
        if (isAuthError(error)) handleAuthError();
      },
    }),
    mutationCache: new MutationCache({
      onError(error) {
        if (isAuthError(error)) handleAuthError();
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        // Не ретраить 401 — сразу выбрасываем в onError выше
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}
