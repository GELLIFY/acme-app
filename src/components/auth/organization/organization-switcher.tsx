"use client";

import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Kbd } from "@/components/ui/kbd";
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
import { CreateOrganizationForm } from "./create-organization-form";

export function OrganizationSwitcher() {
  const panelRef = useRef<HTMLUListElement>(null);
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
    if (organizationId === activeOrganization?.id) return;

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

  useHotkey(
    "Mod+P",
    () => {
      setActiveOrganization(null);
    },
    { target: panelRef },
  );

  return (
    <SidebarMenu ref={panelRef}>
      <SidebarMenuItem>
        <Dialog>
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
                {organizations?.map((org) => (
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
                    <DropdownMenuShortcut>
                      {activeOrganization?.id === org.id ? (
                        <Button
                          className="group-focus/dropdown-menu-item:opacity-100 opacity-0 transition-opacity"
                          variant="ghost"
                          size="icon-sm"
                          render={
                            <Link href="/organization">
                              <SettingsIcon />
                            </Link>
                          }
                        ></Button>
                      ) : (
                        <div className="pr-2">
                          <ArrowRightIcon className="group-focus/dropdown-menu-item:opacity-100 opacity-0 transition-opacity" />
                        </div>
                      )}
                    </DropdownMenuShortcut>
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
                  <DropdownMenuShortcut>
                    <Kbd>{formatForDisplay("Mod+P")}</Kbd>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DialogTrigger
                  nativeButton={false}
                  render={
                    <DropdownMenuItem className="gap-2 p-2">
                      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                        <PlusIcon className="size-4" />
                      </div>
                      {t("create.open")}
                    </DropdownMenuItem>
                  }
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog content here to prevent autoclose on DropdownItem click */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("create.title")}</DialogTitle>
              <DialogDescription>{t("create.description")}</DialogDescription>
            </DialogHeader>

            <CreateOrganizationForm />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
