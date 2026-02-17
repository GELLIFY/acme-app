"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailPlusIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { CopyButton } from "@/components/copy-button";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { auth } from "@/libs/better-auth/auth";
import { authClient } from "@/libs/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";
import { buildInvitationUrl } from "./utils";

type ActiveOrganization = Awaited<
  ReturnType<typeof auth.api.getFullOrganization>
>;
type Invitation = NonNullable<ActiveOrganization>["invitations"][number];

const ROLE = {
  MEMBER: "member",
  ADMIN: "admin",
} as const;

const INVITE_ROLES = [ROLE.MEMBER, ROLE.ADMIN] as const;

const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(INVITE_ROLES),
});

type InviteMemberForm = z.infer<typeof inviteMemberSchema>;

export function OrganizationInviteMember({
  organizationId,
  invitations,
  canManageInvites,
  onChanged,
}: {
  organizationId: string;
  invitations: Invitation[];
  canManageInvites: boolean;
  onChanged: () => void;
}) {
  const t = useScopedI18n("organization");
  const pathname = usePathname();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteMemberForm>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: ROLE.MEMBER,
    },
  });

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "pending",
  );

  const onSubmit = (values: InviteMemberForm) => {
    startTransition(async () => {
      const { data, error } = await authClient.organization.inviteMember({
        email: values.email,
        role: values.role,
        organizationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      const origin = window.location.origin;
      const url = buildInvitationUrl(origin, pathname, data.id);
      setInviteUrl(url);
      form.reset({ email: "", role: ROLE.MEMBER });
      toast.success(t("messages.invited"));
      onChanged();
    });
  };

  const onCancelInvitation = (invitationId: string) => {
    startTransition(async () => {
      const { error } = await authClient.organization.cancelInvitation({
        invitationId,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      toast.success(t("messages.canceled"));
      onChanged();
    });
  };

  if (!canManageInvites) {
    return (
      <p className="text-sm font-medium text-muted-foreground">
        {t("invite.no_permission")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="invite_email">
                {t("invite.email")}
              </FieldLabel>
              <Input
                {...field}
                id="invite_email"
                placeholder="name@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="invite_role">{t("invite.role")}</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="invite_role"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLE.MEMBER}>
                    {t("invite.role_member")}
                  </SelectItem>
                  <SelectItem value={ROLE.ADMIN}>
                    {t("invite.role_admin")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <MailPlusIcon />
              {t("invite.submit")}
            </>
          )}
        </Button>
      </form>

      {inviteUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("invite.link_label")}</p>
          <div className="relative rounded-md border bg-muted p-3 pr-12 text-xs break-all">
            <CopyButton value={inviteUrl} tooltip={t("invite.copy")} />
            {inviteUrl}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">{t("invite.pending")}</p>
        {pendingInvitations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("invite.pending_empty")}
          </p>
        ) : (
          pendingInvitations.map((invitation) => (
            <Item key={invitation.id} variant="outline" size="sm">
              <ItemMedia variant="icon">
                <MailPlusIcon size={16} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{invitation.email}</ItemTitle>
                <ItemDescription className="flex items-center gap-2">
                  <Badge variant="outline">{invitation.role}</Badge>
                  <Badge variant="outline">{invitation.status}</Badge>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        disabled={isPending}
                      >
                        <TrashIcon />
                      </Button>
                    }
                  ></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("invite.cancel_title")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("invite.cancel_description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("common.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCancelInvitation(invitation.id)}
                      >
                        {t("invite.cancel_confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ItemActions>
            </Item>
          ))
        )}
      </div>
    </div>
  );
}
