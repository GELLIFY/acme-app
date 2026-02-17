"use client";

import { Building2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import type { auth, OrganizationRole } from "@/libs/better-auth/auth";
import { useScopedI18n } from "@/shared/locales/client";
import { OrganizationInviteMember } from "./organization-invite-member";
import { OrganizationMembersList } from "./organization-members-list";

type ActiveOrganization = Awaited<
  ReturnType<typeof auth.api.getFullOrganization>
>;

const ORGANIZATION_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const satisfies Record<string, OrganizationRole>;

export function OrganizationManager({
  activeOrganization,
  currentUserId,
}: {
  activeOrganization: ActiveOrganization | null;
  currentUserId: string;
}) {
  const t = useScopedI18n("organization");
  const router = useRouter();

  const refreshPage = () => {
    router.refresh();
  };

  const activeMember = activeOrganization?.members.find(
    (member) => member.userId === currentUserId,
  );

  const canManageInvites = Boolean(
    activeMember &&
      (activeMember.role === ORGANIZATION_ROLES.OWNER ||
        activeMember.role === ORGANIZATION_ROLES.ADMIN),
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {activeOrganization ? (
            <>
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center bg-muted text-2xl font-medium uppercase">
                  {activeOrganization.name.at(0)}
                </div>
                <div>
                  <p className="text-base font-semibold">
                    {activeOrganization.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("summary.members", {
                      count: activeOrganization.members.length,
                    })}
                  </p>
                </div>
                <Badge className="ml-auto">{activeOrganization.slug}</Badge>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {t("members.title")}
                  </h3>
                  <Separator />
                  <OrganizationMembersList
                    members={activeOrganization.members}
                    currentUserId={currentUserId}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {t("invite.title")}
                  </h3>
                  <Separator />
                  <OrganizationInviteMember
                    organizationId={activeOrganization.id}
                    invitations={activeOrganization.invitations}
                    canManageInvites={canManageInvites}
                    onChanged={refreshPage}
                  />
                </div>
              </div>
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2Icon />
                </EmptyMedia>
                <EmptyTitle>{t("no_active.title")}</EmptyTitle>
                <EmptyDescription>
                  {t("no_active.description")}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      {/*<OrganizationIncomingInvitations
        invitations={incomingInvitations}
        invitationFromQuery={invitationFromQuery}
        invitationQueryId={invitationQueryId}
        onChanged={refreshPage}
      />*/}
    </div>
  );
}
