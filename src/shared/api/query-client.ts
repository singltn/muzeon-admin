import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./http-client";

let globalOnAuthError: (() => void) | null = null;

export function registerAuthErrorHandler(fn: () => void) {
  globalOnAuthError = fn;
}

export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) return false;
          return failureCount < 1;
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
    queryCache: undefined,
  });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    if (
      error.status === 401 ||
      error.code === "AUTH_REQUIRED" ||
      error.code === "SESSION_EXPIRED"
    ) {
      globalOnAuthError?.();
    }
  }
}
