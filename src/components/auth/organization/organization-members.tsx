"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function OrganizationMembers({
  activeOrganizationId,
  currentUserId,
}: {
  activeOrganizationId: string;
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const t = useScopedI18n("organization");

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.organization.listMembers.queryOptions({
      organizationId: activeOrganizationId,
    }),
  );

  const removeMember = (memberId: string) => {
    startTransition(async () => {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: activeOrganizationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      queryClient.invalidateQueries({
        queryKey: trpc.organization.listMembers.queryKey({
          organizationId: activeOrganizationId,
        }),
      });

      toast.success(t("messages.active_set"));
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("members.title")}</CardTitle>
        <CardDescription>{t("members.description")}</CardDescription>
        <CardAction>
          <Button size="sm">
            <PlusIcon />
            Add Member
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.members.map((member) => {
            return (
              <Item key={member.id} variant="outline" size="sm">
                <ItemMedia>
                  <Avatar>
                    <AvatarImage
                      src={member.user.image}
                      className="grayscale"
                    />
                    <AvatarFallback>
                      {member.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="w-full justify-between">
                    <span className="truncate">{member.user.name}</span>
                  </ItemTitle>
                  <ItemDescription>{member.user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <div className="flex items-center gap-2">
                    {member.userId === currentUserId && (
                      <Badge variant="outline">{t("members.me")}</Badge>
                    )}
                    <Badge>{member.role}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => removeMember(member.id)}
                  >
                    Remove
                  </Button>
                </ItemActions>
              </Item>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
