"use client";

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
import type { Organization } from "@/libs/better-auth/auth";
import { authClient } from "@/libs/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: {
  organizations: Organization[];
  activeOrganizationId: string | null;
}) {
  const t = useScopedI18n("organization");
  const [isPending, startTransition] = useTransition();
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState(activeOrganizationId);

  useEffect(() => {
    setSelectedOrganizationId(activeOrganizationId);
  }, [activeOrganizationId]);

  const onValueChange = (organizationId: string | null) => {
    setSelectedOrganizationId(organizationId);

    if (!organizationId || organizationId === activeOrganizationId) return;

    startTransition(async () => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      toast.success(t("messages.active_set"));
    });
  };

  const activeOrganization = organizations.find(
    (org) => org.id === selectedOrganizationId,
  );

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
          {activeOrganization ? (
            <>
              <Avatar size="sm">
                <AvatarImage
                  src={activeOrganization?.logo ?? ""}
                  alt={`${activeOrganization.name} logo`}
                />
                <AvatarFallback>
                  {activeOrganization.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {activeOrganization.name}
            </>
          ) : (
            <span className="text-muted-foreground">
              {t("switcher.placeholder")}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={t("switcher.placeholder")}>Personal</SelectItem>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
