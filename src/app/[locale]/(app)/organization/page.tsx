import { all } from "better-all";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OrganizationTabs from "@/components/auth/organization/organization-tabs";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import {
  caller,
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/libs/trpc/server";

export const metadata: Metadata = {
  title: "Organization | Acme",
  description: "Organization management page",
};

export default async function OrganizationPage() {
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  const queryClient = getQueryClient();

  // parallel prefetch
  await all({
    async activeOrganization() {
      return await caller.organization.active();
    },
    async organizations() {
      return await queryClient.prefetchQuery(
        trpc.organization.list.queryOptions(),
      );
    },
    async members() {
      return await queryClient.prefetchQuery(
        trpc.organization.listMembers.queryOptions({
          organizationId: (await this.$.activeOrganization)?.id,
        }),
      );
    },
    async invitations() {
      return await queryClient.prefetchQuery(
        trpc.organization.listInvitations.queryOptions({
          organizationId: (await this.$.activeOrganization)?.id,
        }),
      );
    },
  });

  return (
    <HydrateClient>
      <OrganizationTabs />
    </HydrateClient>
  );
}
