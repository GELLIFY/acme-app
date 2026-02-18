"use client";

import { Building2Icon, TriangleAlertIcon, UsersIcon } from "lucide-react";
import { DeleteOrganization } from "@/components/auth/organization/delete-organization";
import { NoOrganization } from "@/components/auth/organization/no-organization";
import { OrganizationLogo } from "@/components/auth/organization/organization-logo";
import { OrganizationName } from "@/components/auth/organization/organization-name";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useScopedI18n } from "@/shared/locales/client";

export default function OrganizationTabs() {
  const t = useScopedI18n("organization");
  const { data: activeOrganization } = useOrganizationQuery();

  return (
    <Tabs className="space-y-2" defaultValue="organization">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="organization">
          <Building2Icon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">{t("menu")}</span>
        </TabsTrigger>
        <TabsTrigger value="members" disabled={!activeOrganization}>
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
          {!activeOrganization ? (
            <NoOrganization />
          ) : (
            <>
              <OrganizationLogo />
              <OrganizationName />
            </>
          )}
        </div>
      </TabsContent>
      <TabsContent value="members">
        <div className="text-muted-foreground space-y-4">
          {/*<OrganizationManager
                activeOrganization={activeOrganization}
                currentUserId={session.user.id}
              />*/}
        </div>
      </TabsContent>
      <TabsContent value="danger">
        <DeleteOrganization />
      </TabsContent>
    </Tabs>
  );
}
