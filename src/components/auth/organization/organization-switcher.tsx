"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useUserQuery } from "@/hooks/use-user";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

export function OrganizationSwitcher() {
  const t = useScopedI18n("organization");
  const [isPending, startTransition] = useTransition();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user } = useUserQuery();
  const { data: activeOrganization } = useOrganizationQuery();
  const { data: organizations } = useQuery({
    ...trpc.organization.list.queryOptions(),
    initialData: [],
  });

  useEffect(() => {
    setSelectedOrganizationId(activeOrganization?.id ?? null);
  }, [activeOrganization]);

  const onValueChange = (organizationId: string | null) => {
    setSelectedOrganizationId(organizationId);

    startTransition(async () => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      queryClient.invalidateQueries({
        queryKey: trpc.organization.active.queryKey(),
      });

      toast.success(t("messages.active_set"));
    });
  };

  return (
    <Select
      value={selectedOrganizationId || t("switcher.placeholder")}
      onValueChange={onValueChange}
      disabled={isPending}
      items={organizations.map((organization) => ({
        value: organization.id,
        label: organization.name,
      }))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("switcher.placeholder")}>
          <Avatar size="sm">
            <AvatarImage
              src={activeOrganization?.logo ?? user.image ?? ""}
              alt={`${activeOrganization?.name ?? user.name} logo`}
            />
            <AvatarFallback>
              {activeOrganization?.name.charAt(0).toUpperCase() ??
                user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {activeOrganization?.name ?? user.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={null}>Personal</SelectItem>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
