"use client";

import { Building2Icon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useScopedI18n } from "@/shared/locales/client";

export function NoOrganization() {
  const t = useScopedI18n("organization");

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Building2Icon />
        </EmptyMedia>
        <EmptyTitle>{t("no_active.title")}</EmptyTitle>
        <EmptyDescription>{t("no_active.description")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
