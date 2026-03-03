"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { MailPlusIcon, PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/libs/better-auth/auth-client";
import { ORGANIZATION_ROLES } from "@/libs/better-auth/permissions";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(ORGANIZATION_ROLES),
  resend: z.boolean().optional(),
});

export function InviteMemberDialog({
  activeOrganizationId,
}: {
  activeOrganizationId: string;
}) {
  const t = useScopedI18n("organization");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: ORGANIZATION_ROLES.MEMBER,
    },
  });

  const onSubmit = (values: z.infer<typeof inviteMemberSchema>) => {
    startTransition(async () => {
      const { error } = await authClient.organization.inviteMember({
        email: values.email,
        role: values.role,
      });

      if (error) {
        toast.error(error.message || t("messages.error"));
        return;
      }

      queryClient.invalidateQueries({
        queryKey: trpc.organization.listInvitations.queryKey({
          organizationId: activeOrganizationId,
        }),
      });

      toast.success(t("messages.created"));
      form.reset();
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(newState) => !newState && form.reset()}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <PlusIcon className="size-4" />
            {t("invite.pending_invite_btn")}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("invite.title")}</DialogTitle>
          <DialogDescription>{t("invite.description")}</DialogDescription>
        </DialogHeader>

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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="invite_role">
                  {t("invite.role")}
                </FieldLabel>
                <Select {...field}>
                  <SelectTrigger>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
      </DialogContent>
    </Dialog>
  );
}
