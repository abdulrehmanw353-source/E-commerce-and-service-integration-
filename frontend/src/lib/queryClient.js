import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client configuration.
 * 
 * - staleTime: 5 minutes — data is fresh for 5 min, no refetch
 * - retry: 1 — retry once on failure
 * - refetchOnWindowFocus: false — don't refetch when tabbing back
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
