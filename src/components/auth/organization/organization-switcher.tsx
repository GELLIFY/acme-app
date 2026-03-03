"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  Building2Icon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  ShieldUserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useUserQuery } from "@/hooks/use-user";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { cn } from "@/libs/utils";
import { useScopedI18n } from "@/shared/locales/client";
import { CreateOrganizationForm } from "./create-organization-form";

export function OrganizationSwitcher() {
  const router = useRouter();
  const t = useScopedI18n("organization");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user } = useUserQuery();
  const { data: activeOrganization } = useOrganizationQuery();
  const { data: organizations } = useQuery(
    trpc.organization.list.queryOptions(),
  );
  const { data: invitations } = useQuery(
    trpc.organization.listUserInvitations.queryOptions({ email: user.email }),
  );

  const setActiveOrganizationMutation = useMutation({
    mutationFn: async (organizationId: string | null) => {
      const { error } = await authClient.organization.setActive({
        organizationId,
      });

      if (error) {
        throw new Error(error.message || t("messages.error"));
      }

      return organizationId;
    },
    onMutate: async (organizationId) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: trpc.organization.active.queryKey(),
        }),
        queryClient.cancelQueries({
          queryKey: trpc.organization.listMembers.queryKey({
            organizationId: activeOrganization?.id,
          }),
        }),
        queryClient.cancelQueries({
          queryKey: trpc.organization.listInvitations.queryKey({
            organizationId: activeOrganization?.id,
          }),
        }),
      ]);

      const previousActiveOrganization = queryClient.getQueryData(
        trpc.organization.active.queryKey(),
      );

      const nextActiveOrganization = organizationId
        ? (organizations?.find((org) => org.id === organizationId) ?? null)
        : null;

      queryClient.setQueryData(
        trpc.organization.active.queryKey(),
        nextActiveOrganization,
      );

      return { previousActiveOrganization };
    },
    onError: (error, _organizationId, context) => {
      if (context?.previousActiveOrganization !== undefined) {
        queryClient.setQueryData(
          trpc.organization.active.queryKey(),
          context.previousActiveOrganization,
        );
      }

      toast.error(error.message || t("messages.error"));
    },
    onSuccess: () => {
      toast.success(t("messages.active_set"));
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trpc.organization.active.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.organization.list.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.organization.listMembers.queryKey({
            organizationId: activeOrganization?.id,
          }),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.organization.listInvitations.queryKey({
            organizationId: activeOrganization?.id,
          }),
        }),
      ]);
    },
  });

  const setActiveOrganization = (organizationId: string | null) => {
    if (organizationId === activeOrganization?.id) return;
    setActiveOrganizationMutation.mutate(organizationId);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="lg"
              className="h-auto p-0 hover:bg-transparent"
            />
          }
        >
          <Avatar>
            <AvatarImage
              src={
                activeOrganization
                  ? (activeOrganization.logo ?? undefined)
                  : (user.image ?? undefined)
              }
              alt={activeOrganization ? activeOrganization.name : user.name}
            />
            <AvatarFallback>
              {activeOrganization?.name.substring(0, 2).toUpperCase() ??
                user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("switcher.label")}
            </DropdownMenuLabel>
            {organizations?.map((org) => (
              <DropdownMenuItem
                key={org.id}
                disabled={setActiveOrganizationMutation.isPending}
                onClick={() => setActiveOrganization(org.id)}
                className={cn("gap-2 p-2", {
                  "focus:bg-transparent focus:text-primary":
                    activeOrganization?.id === org.id,
                })}
              >
                <Avatar size="sm">
                  <AvatarImage src={org?.logo ?? ""} alt={org.name} />
                  <AvatarFallback className="text-primary">
                    {org.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {org.name}
                <DropdownMenuShortcut>
                  {activeOrganization?.id === org.id ? (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      nativeButton={false}
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
            {invitations?.map((invitation) => (
              <DropdownMenuItem
                key={invitation.id}
                className={cn(
                  "gap-2 p-2 focus:bg-transparent focus:text-primary",
                )}
              >
                <Avatar size="sm">
                  <AvatarFallback>
                    <Building2Icon className="size-3" />
                  </AvatarFallback>
                </Avatar>
                {invitation.organizationName}
                <DropdownMenuShortcut>
                  <Button
                    variant="outline"
                    size="xs"
                    render={
                      <Link href={`/accept-invitation/${invitation.id}`}>
                        Join
                      </Link>
                    }
                    nativeButton={false}
                  />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DialogTrigger
              nativeButton={false}
              render={
                <DropdownMenuItem className="p-2">
                  <div className="flex size-6 border rounded-full items-center justify-center">
                    <PlusIcon className="size-3.5" />
                  </div>
                  {t("create.open")}
                </DropdownMenuItem>
              }
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t("switcher.placeholder")}
            </DropdownMenuLabel>
            <DropdownMenuItem
              disabled={setActiveOrganizationMutation.isPending}
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
                {!activeOrganization ? (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    nativeButton={false}
                    render={
                      <Link href="/account">
                        <SettingsIcon />
                      </Link>
                    }
                  />
                ) : (
                  <div className="pr-2">
                    <ArrowRightIcon className="group-focus/dropdown-menu-item:opacity-100 opacity-0 transition-opacity" />
                  </div>
                )}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {user.role === "admin" && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <Link href="/admin">
                      <ShieldUserIcon />
                      Admin
                    </Link>
                  }
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in"); // redirect to login page
                  },
                },
              });
            }}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
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
  );
}
