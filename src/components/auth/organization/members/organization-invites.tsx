"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { useTRPC } from "@/libs/trpc/client";
import type { RouterOutput } from "@/server/api/trpc/routers/_app";
import { useScopedI18n } from "@/shared/locales/client";
import { InviteMemberDialog } from "./invite-member-dialog";

type Invitation = RouterOutput["organization"]["listInvitations"][number];
type UserInvitation =
  RouterOutput["organization"]["listUserInvitations"][number];

function Invitations({
  invitations,
}: {
  invitations: Invitation[] | UserInvitation[];
}) {
  const t = useScopedI18n("organization");

  return (
    <ItemGroup>
      {invitations.map((invitation) => {
        return (
          <Item key={invitation.id} variant="outline" size="sm">
            <ItemContent>
              <ItemTitle className="">
                <span className="truncate">{invitation.email}</span>
                <Badge variant="secondary">{invitation.role}</Badge>
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="destructive">
                {t("invite.cancel_confirm")}
              </Button>
            </ItemActions>
          </Item>
        );
      })}
    </ItemGroup>
  );
}

export function OrganizationInvites({
  activeOrganizationId,
}: {
  activeOrganizationId: string;
}) {
  const t = useScopedI18n("organization");
  const trpc = useTRPC();

  const { data: invitations } = useQuery(
    trpc.organization.listInvitations.queryOptions({
      organizationId: activeOrganizationId,
    }),
  );

  if (!invitations || invitations.length === 0)
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>
          </EmptyMedia>
          <EmptyTitle>{t("invite.pending_empty")}</EmptyTitle>
          <EmptyDescription>
            {t("invite.pending_empty_description")}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InviteMemberDialog activeOrganizationId={activeOrganizationId} />
        </EmptyContent>
      </Empty>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invite.pending")}</CardTitle>
        <CardDescription>{t("invite.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Invitations invitations={invitations} />
        </div>
      </CardContent>
    </Card>
  );
}
