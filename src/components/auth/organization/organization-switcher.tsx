"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDownIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useUserQuery } from "@/hooks/use-user";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { CreateOrganizationDialog } from "./create-organization-dialog";

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = useTransition();

  const t = useScopedI18n("organization");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user } = useUserQuery();
  const { data: activeOrganization } = useOrganizationQuery();
  const { data: organizations } = useQuery(
    trpc.organization.list.queryOptions(),
  );

  const setActiveOrganization = (organizationId: string | null) => {
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar>
              <AvatarImage
                src={activeOrganization?.logo ?? user.image ?? ""}
                alt={activeOrganization?.name ?? user.name}
              />
              <AvatarFallback>
                {activeOrganization?.name.substring(0, 2).toUpperCase() ??
                  user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {activeOrganization?.name ?? user.name}
              </span>
              <span className="truncate text-xs">
                {activeOrganization?.slug ?? user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {organizations?.map((org, index) => (
                <DropdownMenuItem
                  key={org.name}
                  disabled={isPending}
                  onClick={() => setActiveOrganization(org.id)}
                  className="gap-2 p-2"
                >
                  <Avatar size="sm">
                    <AvatarImage src={org?.logo ?? ""} alt={org.name} />
                    <AvatarFallback>
                      {org.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {org.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {t("switcher.placeholder")}
              </DropdownMenuLabel>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => setActiveOrganization(null)}
                className="gap-2 p-2"
              >
                <Avatar size="sm">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {`${user.name}`}
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="gap-2 p-2"
                render={<CreateOrganizationDialog />}
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
