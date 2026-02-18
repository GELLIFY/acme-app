"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon, Send, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function NoInvites() {
  const t = useScopedI18n("organization");

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SendIcon className="size-4" />
        </EmptyMedia>
        <EmptyTitle>No Invitations</EmptyTitle>
        <EmptyDescription>
          Invite your team to collaborate on this project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <PlusIcon />
          Invite Members
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function OrganizationInvites({
  activeOrganizationId,
}: {
  activeOrganizationId: string;
}) {
  const t = useScopedI18n("organization");

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.organization.listInvitations.queryOptions({
      organizationId: activeOrganizationId,
    }),
  );

  if (!data || data.length === 0) return <NoInvites />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("invites.title")}</CardTitle>
        <CardDescription>{t("invites.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((invitation) => {
            return (
              <Item key={invitation.id} variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle className="w-full justify-between">
                    <span className="truncate">{invitation.email}</span>
                  </ItemTitle>
                  <ItemDescription>{invitation.role}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <div className="flex items-center gap-2">
                    <Badge>{invitation.role}</Badge>
                  </div>
                </ItemActions>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
