"use client";

import { Building2Icon, UsersIcon } from "lucide-react";
import { DeleteOrganization } from "@/components/auth/organization/delete-organization";
import { NoOrganization } from "@/components/auth/organization/no-organization";
import { OrganizationLogo } from "@/components/auth/organization/organization-logo";
import { OrganizationName } from "@/components/auth/organization/organization-name";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useUserQuery } from "@/hooks/use-user";
import { useScopedI18n } from "@/shared/locales/client";
import { OrganizationInvites } from "./members/organization-invites";
import { OrganizationMembers } from "./members/organization-members";

export default function OrganizationTabs() {
  const t = useScopedI18n("organization");
  const { data: user } = useUserQuery();
  const { data: activeOrganization } = useOrganizationQuery();

  return (
    <Tabs className="space-y-2" defaultValue="organization">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="organization">
          <Building2Icon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">{t("menu")}</span>
        </TabsTrigger>
        <TabsTrigger value="members" disabled={!activeOrganization}>
          <UsersIcon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">{t("members.title")}</span>
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
              <DeleteOrganization organizationId={activeOrganization.id} />
            </>
          )}
        </div>
      </TabsContent>
      <TabsContent value="members">
        <div className="text-muted-foreground space-y-4">
          {activeOrganization && (
            <>
              <OrganizationMembers
                activeOrganizationId={activeOrganization.id}
                currentUserId={user.id}
              />
              <OrganizationInvites
                activeOrganizationId={activeOrganization.id}
              />
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
