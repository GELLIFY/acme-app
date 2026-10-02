"use client";

import { ShieldUserIcon } from "lucide-react";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/libs/better-auth/auth-client";

/** The link to the admin dashboard, for an admin only. */
export function AdminMenuItem() {
  const { data } = authClient.useSession();
  if (data?.user.role !== "admin") return null;

  return (
    <DropdownMenuItem
      render={
        <Link href="/admin">
          <ShieldUserIcon />
          Admin
        </Link>
      }
    ></DropdownMenuItem>
  );
}
