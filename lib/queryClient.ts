// ============================================================
// XFLIX — Lib
// queryClient: React Query configuration
// ============================================================

import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance with Xflix optimized defaults.
 * - staleTime: 5 minutes (reduces unnecessary refetches)
 * - retry: 2 times on failure
 * - refetchOnWindowFocus: disabled for better UX
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
