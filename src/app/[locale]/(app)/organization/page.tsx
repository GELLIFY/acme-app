import { all } from "better-all";
import { Building2Icon, UsersIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteOrganization } from "@/components/auth/organization/delete-organization";
import { OrganizationInvites } from "@/components/auth/organization/members/organization-invites";
import { OrganizationMembers } from "@/components/auth/organization/members/organization-members";
import { OrganizationLogo } from "@/components/auth/organization/organization-logo";
import { OrganizationName } from "@/components/auth/organization/organization-name";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/libs/better-auth/auth";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("organization");

  return {
    title: `${t("title")} | Acme`,
    description: t("description"),
  };
}

export default async function OrganizationPage() {
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  const queryClient = getQueryClient();
  const activeOrganization = await queryClient.fetchQuery(
    trpc.organization.active.queryOptions(),
  );

  if (!activeOrganization) return redirect("/organization/new");

  const { t, canUpdateOrganization, canDeleteOrganization } = await all({
    async headersList() {
      return await headers();
    },
    async t() {
      return await getScopedI18n("organization");
    },
    async canUpdateOrganization() {
      const { error, success } = await auth.api.hasPermission({
        headers: await this.$.headersList,
        body: { permissions: { organization: ["update"] } },
      });

      return error ? false : success;
    },
    async canDeleteOrganization() {
      const { error, success } = await auth.api.hasPermission({
        headers: await this.$.headersList,
        body: { permissions: { organization: ["delete"] } },
      });

      return error ? false : success;
    },
    async prefetchCurrentUser() {
      return queryClient.prefetchQuery(trpc.user.me.queryOptions());
    },
    async prefetchOrganizationList() {
      return queryClient.prefetchQuery(trpc.organization.list.queryOptions());
    },
    async prefetchMemberList() {
      return queryClient.prefetchQuery(
        trpc.organization.listMembers.queryOptions({
          organizationId: activeOrganization.id,
        }),
      );
    },
    async prefetchInvitationsList() {
      return queryClient.prefetchQuery(
        trpc.organization.listInvitations.queryOptions({
          organizationId: activeOrganization.id,
        }),
      );
    },
  });

  return (
    <HydrateClient>
      <Tabs className="space-y-2" defaultValue="organization">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="organization"
            aria-label={t("menu")}
            title={t("menu")}
          >
            <Building2Icon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("menu")}</span>
          </TabsTrigger>
          <TabsTrigger
            value="members"
            disabled={!activeOrganization}
            aria-label={t("members.title")}
            title={t("members.title")}
          >
            <UsersIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("members.title")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <div className="text-muted-foreground space-y-4">
            <OrganizationLogo canUpdateOrganization={canUpdateOrganization} />
            <OrganizationName canUpdateOrganization={canUpdateOrganization} />
            <DeleteOrganization
              organizationId={activeOrganization.id}
              canDeleteOrganization={canDeleteOrganization}
            />
          </div>
        </TabsContent>
        <TabsContent value="members">
          <div className="text-muted-foreground space-y-4">
            {activeOrganization && (
              <>
                <OrganizationMembers
                  activeOrganizationId={activeOrganization.id}
                />
                <OrganizationInvites
                  activeOrganizationId={activeOrganization.id}
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
