"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { browserLogger } from "@/shared/infrastructure/logger/browser-logger";
import { useTRPC } from "@/shared/infrastructure/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { changePasswordSchema } from "@/shared/validators/user.schema";

export function UpdatePassword() {
  const t = useScopedI18n("account.security.change_password");
  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const changePasswordMutation = useMutation(
    trpc.user.changePassword.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
        browserLogger.error(error.message, new Error(error.message));
      },
      onSuccess: () => {
        toast.success("Password changed");
        router.push("/sign-in");
      },
    }),
  );

  const onSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="current_password">
                      {t("current_password_fld")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="current_password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new_password">
                      {t("new_password_fld")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="new_password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      autoComplete="new-password"
                    />
                    <FieldDescription>{t("new_password_msg")}</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="revokeOtherSessions"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <Checkbox
                      id="revoke"
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                    <FieldLabel htmlFor="revoke">{t("revoke_fld")}</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="border-t text-muted-foreground text-sm justify-between">
          <div>{t("message")}</div>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? <Spinner /> : t("submit")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
