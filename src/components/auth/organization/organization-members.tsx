"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/libs/better-auth/auth-client";
import { ORGANIZATION_ROLES } from "@/libs/better-auth/permissions";
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

      toast.success(t("members.removed"));
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("members.title")}</CardTitle>
        <CardDescription>
          {t("members.description", { count: data?.members.length ?? 0 })}
        </CardDescription>
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
                  <ItemTitle className="w-full">
                    <span className="truncate">{member.user.name}</span>
                  </ItemTitle>
                  <ItemDescription>{member.user.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Select
                    value={member.role}
                    // onValueChange={(value) => handleSetUserRole(value as Role)}
                    disabled={currentUserId === member.user.id}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue
                        placeholder={t("members.role_placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ORGANIZATION_ROLES).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    disabled={isPending || currentUserId === member.user.id}
                    onClick={() => removeMember(member.id)}
                  >
                    <Trash2Icon />
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
