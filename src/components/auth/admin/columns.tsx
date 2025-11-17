import type { ColumnDef } from "@tanstack/react-table";
import type { UserWithRole } from "better-auth/plugins";
import { format } from "date-fns";
import {
  ArrowUpDown,
  BadgeCheck,
  BanIcon,
  CopyIcon,
  HatGlassesIcon,
  LogOutIcon,
  MoreHorizontal,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/shared/helpers/better-auth/auth-client";

export const columns: ColumnDef<UserWithRole>[] = [
  {
    id: "select",
    meta: {
      className: "w-9 max-w-9 min-w-9 px-3",
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="flex cursor-pointer items-center justify-center size-10">
            <AvatarImage className="size-10" src={user.image ?? undefined} />
            <AvatarFallback>
              <UserIcon className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium flex items-center gap-2">
              {user.name}
            </div>
            <span className="mt-0.5 text-xs text-muted-foreground flex items-center gap-2">
              {user.email}
              {user.emailVerified && (
                <BadgeCheck className="size-3.5 text-green-600" />
              )}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));

      return (
        <div className="lowercase">{format(createdAt, "MMM dd, yyyy")}</div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <Badge>{row.getValue("role")}</Badge>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    meta: {
      className: "w-14 max-w-14 min-w-14",
    },
    cell: ({ row }) => {
      const user = row.original;

      const router = useRouter();
      const { data, refetch } = authClient.useSession();

      function handleImpersonateUser(userId: string) {
        authClient.admin.impersonateUser(
          { userId },
          {
            onError: (error) => {
              toast.error(error.error.message || "Failed to impersonate");
            },
            onSuccess: () => {
              refetch();
              router.push("/");
            },
          },
        );
      }

      function handleBanUser(userId: string) {
        authClient.admin.banUser(
          { userId },
          {
            onError: (error) => {
              toast.error(error.error.message || "Failed to ban user");
            },
            onSuccess: () => {
              toast.success("User banned");
              router.refresh();
            },
          },
        );
      }

      function handleUnbanUser(userId: string) {
        authClient.admin.unbanUser(
          { userId },
          {
            onError: (error) => {
              toast.error(error.error.message || "Failed to unban user");
            },
            onSuccess: () => {
              toast.success("User unbanned");
              router.refresh();
            },
          },
        );
      }

      function handleRevokeSessions(userId: string) {
        authClient.admin.revokeUserSessions(
          { userId },
          {
            onError: (error) => {
              toast.error(
                error.error.message || "Failed to revoke user sessions",
              );
            },
            onSuccess: () => {
              toast.success("User sessions revoked");
            },
          },
        );
      }

      function handleRemoveUser(userId: string) {
        authClient.admin.removeUser(
          { userId },
          {
            onError: (error) => {
              toast.error(error.error.message || "Failed to delete user");
            },
            onSuccess: () => {
              toast.success("User deleted");
              router.refresh();
            },
          },
        );
      }

      if (data?.session.userId === user.id) {
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <CopyIcon />
              Copy user ID
            </DropdownMenuItem>

            {data?.session.userId !== user.id && (
              <>
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  <HatGlassesIcon />
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                  <LogOutIcon />
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                    <BanIcon />
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant="destructive">
                      <TrashIcon />
                      Delete User
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveUser(user.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
