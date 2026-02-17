"use client";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { auth } from "@/libs/better-auth/auth";
import { useScopedI18n } from "@/shared/locales/client";

type ActiveOrganization = Awaited<
  ReturnType<typeof auth.api.getFullOrganization>
>;
type Member = NonNullable<ActiveOrganization>["members"][number];

function getMemberIdentity(member: Member) {
  const user = (member as Member & { user?: { name?: string; email?: string } })
    .user;

  return {
    name: user?.name ?? member.userId,
    subtitle: user?.email ?? "",
  };
}

function toPrettyRole(role: string) {
  return role
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value[0]?.toUpperCase() + value.slice(1))
    .join(", ");
}

export function OrganizationMembersList({
  members,
  currentUserId,
}: {
  members: Member[];
  currentUserId: string;
}) {
  const t = useScopedI18n("organization");

  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("members.empty.description")}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const identity = getMemberIdentity(member);

        return (
          <Item key={member.id} variant="outline" size="sm">
            <ItemMedia variant="icon">
              {identity.name.at(0)?.toUpperCase()}
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="w-full justify-between">
                <span className="truncate">{identity.name}</span>
                <div className="flex items-center gap-2">
                  {member.userId === currentUserId && (
                    <Badge variant="outline">{t("members.me")}</Badge>
                  )}
                  <Badge>{toPrettyRole(member.role)}</Badge>
                </div>
              </ItemTitle>
              {identity.subtitle ? (
                <ItemDescription>{identity.subtitle}</ItemDescription>
              ) : null}
            </ItemContent>
          </Item>
        );
      })}
    </div>
  );
}
