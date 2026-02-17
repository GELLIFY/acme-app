"use client";

import { MailIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import type { auth } from "@/libs/better-auth/auth";
import { authClient } from "@/libs/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";

type IncomingInvitation = Awaited<
  ReturnType<typeof auth.api.listUserInvitations>
>[number];
type InvitationFromQuery = Awaited<ReturnType<typeof auth.api.getInvitation>>;

export function OrganizationIncomingInvitations({
  invitations,
  invitationFromQuery,
  invitationQueryId,
  onChanged,
}: {
  invitations: IncomingInvitation[];
  invitationFromQuery: InvitationFromQuery | null;
  invitationQueryId: string | null;
  onChanged: () => void;
}) {
  const t = useScopedI18n("organization");
  const [isPending, startTransition] = useTransition();

  const onAccept = (invitationId: string) => {
    startTransition(async () => {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      toast.success(t("messages.accepted"));
      onChanged();
    });
  };

  const onReject = (invitationId: string) => {
    startTransition(async () => {
      const { error } = await authClient.organization.rejectInvitation({
        invitationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      toast.success(t("messages.rejected"));
      onChanged();
    });
  };

  const listInvitations = invitations.filter(
    (invitation) => invitation.id !== invitationFromQuery?.id,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("incoming.title")}</CardTitle>
        <CardDescription>{t("incoming.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {invitationQueryId && (
          <Item variant="outline">
            <ItemMedia variant="icon">
              <MailIcon size={16} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t("incoming.from_link")}</ItemTitle>
              {invitationFromQuery ? (
                <ItemDescription>
                  {invitationFromQuery.organizationName} -{" "}
                  {invitationFromQuery.role}
                </ItemDescription>
              ) : (
                <ItemDescription>{t("incoming.invalid_link")}</ItemDescription>
              )}
            </ItemContent>
            {invitationFromQuery && (
              <ItemActions>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onReject(invitationFromQuery.id)}
                >
                  {isPending ? <Spinner /> : t("incoming.reject")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onAccept(invitationFromQuery.id)}
                >
                  {isPending ? <Spinner /> : t("incoming.accept")}
                </Button>
              </ItemActions>
            )}
          </Item>
        )}

        {listInvitations.length === 0 ? (
          <Empty className="p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MailIcon />
              </EmptyMedia>
              <EmptyTitle>{t("incoming.empty.title")}</EmptyTitle>
              <EmptyDescription>
                {t("incoming.empty.description")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          listInvitations.map((invitation) => (
            <Item key={invitation.id} variant="outline" size="sm">
              <ItemMedia variant="icon">
                <MailIcon size={16} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{invitation.organizationName}</ItemTitle>
                <ItemDescription className="flex items-center gap-2">
                  <Badge variant="outline">{invitation.role}</Badge>
                  <Badge variant="outline">{invitation.status}</Badge>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => onReject(invitation.id)}
                >
                  {isPending ? <Spinner /> : t("incoming.reject")}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onAccept(invitation.id)}
                >
                  {isPending ? <Spinner /> : t("incoming.accept")}
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
    </Card>
  );
}
