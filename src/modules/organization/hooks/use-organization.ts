"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/libs/trpc/client";

export function useOrganizationQuery() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.organization.active.queryOptions());
}
