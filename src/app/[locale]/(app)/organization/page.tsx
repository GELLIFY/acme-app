import { all } from "better-all";
import { Building2Icon, TriangleAlertIcon, UsersIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateOrganizationDialog } from "@/components/auth/organization/create-organization-dialog";
import { DeleteOrganization } from "@/components/auth/organization/delete-organization";
import { NoOrganization } from "@/components/auth/organization/no-organization";
import { OrganizationAvatar } from "@/components/auth/organization/organization-avatar";
import { OrganizationManager } from "@/components/auth/organization/organization-manager";
import { OrganizationName } from "@/components/auth/organization/organization-name";
import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/libs/better-auth/auth";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";
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
  const t = await getScopedI18n("organization");
  const _filters = loadOrganizationSearchParams(await searchParams);

  // prefetch organization
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.organization.active.queryOptions());

  const { organizations, activeOrganization } = await all({
    async headersList() {
      return await headers();
    },
    async organizations() {
      return auth.api.listOrganizations({
        headers: await this.$.headersList,
      });
    },
    async activeOrganization() {
      return auth.api.getFullOrganization({
        headers: await this.$.headersList,
      });
    },
  });

  return (
    <HydrateClient>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <OrganizationSwitcher
            organizations={organizations}
            activeOrganizationId={activeOrganization?.id ?? null}
          />
          <CreateOrganizationDialog />
        </div>
        <Tabs className="space-y-2" defaultValue="organization">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="organization">
              <Building2Icon size={16} aria-hidden="true" />
              <span className="max-sm:hidden">{t("menu")}</span>
            </TabsTrigger>
            <TabsTrigger value="members">
              <UsersIcon size={16} aria-hidden="true" />
              <span className="max-sm:hidden">{t("members.title")}</span>
            </TabsTrigger>
            <TabsTrigger value="danger" disabled={!activeOrganization}>
              <TriangleAlertIcon size={16} aria-hidden="true" />
              <span className="max-sm:hidden">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <div className="text-muted-foreground space-y-4">
              {activeOrganization ? (
                <>
                  <OrganizationAvatar />
                  <OrganizationName />
                </>
              ) : (
                <NoOrganization />
              )}
            </div>
          </TabsContent>
          <TabsContent value="members">
            <div className="text-muted-foreground space-y-4">
              <OrganizationManager
                activeOrganization={activeOrganization}
                currentUserId={session.user.id}
              />
            </div>
          </TabsContent>
          <TabsContent value="danger">
            <DeleteOrganization />
          </TabsContent>
        </Tabs>
      </div>
    </HydrateClient>
  );
}
