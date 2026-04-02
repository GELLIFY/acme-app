import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 60 seconds — no refetch in this window
        staleTime: 60 * 1000,
        // Keep inactive queries in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Don't refetch on window focus for most apps
        refetchOnWindowFocus: false,
        // Retry failed queries 2 times with exponential backoff
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once (be careful — mutations are not idempotent!)
        retry: 1,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
