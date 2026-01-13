"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/infrastructure/trpc/client";

export function useUserQuery() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.user.me.queryOptions());
}
