"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { authClient } from "@/libs/better-auth/auth-client";
import { ORGANIZATION_ROLES } from "@/libs/better-auth/permissions";
import { useTRPC } from "@/libs/trpc/client";
import type { RouterOutput } from "@/server/api/trpc/routers/_app";
import { useScopedI18n } from "@/shared/locales/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = RouterOutput["organization"]["listMembers"]["members"][0];

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "user.name",
    header: "Member",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={member.user.image} className="grayscale" />
            <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="gap-2 text-sm leading-snug font-medium underline-offset-4 line-clamp-1 flex w-fit items-center">
              {member.user.name}
            </span>
            <span className="text-muted-foreground text-left text-sm leading-normal">
              {member.user.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const member = row.original;
      const t = useScopedI18n("organization");

      return (
        <Select
          value={member.role}
          // onValueChange={(value) => handleSetUserRole(value as Role)}
          // disabled={currentUserId === member.user.id}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder={t("members.role_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ORGANIZATION_ROLES).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;
      const [isPending, startTransition] = useTransition();

      const t = useScopedI18n("organization");
      const queryClient = useQueryClient();
      const trpc = useTRPC();

      const { data: organization } = useOrganizationQuery();
      const activeOrganizationId = organization?.id || "";

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
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                variant="destructive"
                disabled={isPending /*|| currentUserId === member.user.id*/}
                onClick={() => removeMember(member.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
