"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
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
        <EmptyMedia>
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
        <Button size="sm">
          <PlusIcon />
          {t("invite.pending_invite_btn")}
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
        <CardTitle>{t("invite.pending")}</CardTitle>
        <CardDescription>{t("invite.description")}</CardDescription>
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
