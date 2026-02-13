"use client";

import {
  LogOutIcon,
  ShieldUserIcon,
  SunMoonIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/libs/better-auth/auth-client";
import { ThemeToggle } from "./theme-toggle";

type User = typeof authClient.$Infer.Session.user;

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        className="w-auto"
        render={
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image ?? ""}
              alt={`avatar of ${user.name}`}
            />
            <AvatarFallback>{"ME"}</AvatarFallback>
          </Avatar>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="top"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {user.role === "admin" && (
            <DropdownMenuItem
              render={
                <Link href="/admin">
                  <ShieldUserIcon />
                  Admin
                </Link>
              }
            ></DropdownMenuItem>
          )}

          <DropdownMenuItem
            render={
              <Link href="/account">
                <UserIcon />
                Account
              </Link>
            }
          ></DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-transparent justify-between [&_svg:not([class*='text-'])]:text-inherit">
            <div className="flex items-center gap-2">
              <SunMoonIcon className="text-muted-foreground" />
              Theme
            </div>
            <ThemeToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
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
  );
}
