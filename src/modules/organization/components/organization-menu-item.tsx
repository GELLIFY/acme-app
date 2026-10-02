"use client";

import { Building2Icon } from "lucide-react";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useScopedI18n } from "@/shared/locales/client";

/** The link to the page of the active organization. */
export function OrganizationMenuItem() {
  const t = useScopedI18n("organization");

  return (
    <DropdownMenuItem
      render={
        <Link href="/organization">
          <Building2Icon />
          {t("menu")}
        </Link>
      }
    ></DropdownMenuItem>
  );
}
