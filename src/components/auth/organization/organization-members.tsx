"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { columns } from "./members/columns";
import { DataTable } from "./members/data-table";

export function OrganizationMembers({
  activeOrganizationId,
  currentUserId,
}: {
  activeOrganizationId: string;
  currentUserId: string;
}) {
  const t = useScopedI18n("organization");

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.organization.listMembers.queryOptions({
      organizationId: activeOrganizationId,
    }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("members.title")}</CardTitle>
        <CardDescription>
          {t("members.description", { count: data?.members.length ?? 0 })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data?.members ?? []}
          currentUserId={currentUserId}
        />
      </CardContent>
    </Card>
  );
}
