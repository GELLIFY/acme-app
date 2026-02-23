import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OrganizationTabs from "@/components/auth/organization/organization-tabs";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";

export const metadata: Metadata = {
  title: "Organization | Acme",
  description: "Organization management page",
};

export default async function OrganizationPage() {
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  const queryClient = getQueryClient();

  const [activeOrganization] = await Promise.all([
    queryClient.fetchQuery(trpc.organization.active.queryOptions()),
    queryClient.prefetchQuery(trpc.organization.list.queryOptions()),
  ]);

  if (activeOrganization?.id) {
    await Promise.all([
      queryClient.prefetchQuery(
        trpc.organization.listMembers.queryOptions({
          organizationId: activeOrganization.id,
        }),
      ),
      queryClient.prefetchQuery(
        trpc.organization.listInvitations.queryOptions({
          organizationId: activeOrganization.id,
        }),
      ),
    ]);
  }

  return (
    <HydrateClient>
      <OrganizationTabs />
    </HydrateClient>
  );
}
