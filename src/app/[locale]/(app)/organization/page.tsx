import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OrganizationTabs from "@/components/auth/organization/organization-tabs";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";
import { loadOrganizationSearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Organization | Acme",
  description: "Organization management page",
};

export default async function OrganizationPage({
  searchParams,
}: PageProps<"/[locale]/organization">) {
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  // get translations
  const _filters = loadOrganizationSearchParams(await searchParams);

  // prefetch organization
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trpc.organization.active.queryOptions()),
    queryClient.prefetchQuery(trpc.organization.list.queryOptions()),
    // queryClient.prefetchQuery(trpc.organization.listMembers.queryOptions()),
  ]);

  return (
    <HydrateClient>
      <OrganizationTabs />
    </HydrateClient>
  );
}
