"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger/pino-logger";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const formSchema = z
  .object({
    password: z
      .string() // check if it is string type
      .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
      .max(20, { message: "Password must be at most 20 characters long" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const t = useScopedI18n("auth.reset_password");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const { data, error } = await authClient.resetPassword({
          newPassword: values.password, // new password given by user
          token,
        });

        if (error) {
          logger.error(error.statusText, new Error(error.message));
          toast.error(error.message);
          return;
        }

        if (data.status) {
          toast.success("New password has been created");
          router.replace("/sign-in");
        }
      } catch (error) {
        if (error instanceof APIError) {
          logger.error(error.message, error);
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">{t("password_fld")}</FieldLabel>
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              type="password"
              placeholder="password"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="passwordConfirmation"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password_confirmation">
              {t("password_confirmation_fld")}
            </FieldLabel>
            <Input
              {...field}
              id="password_confirmation"
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending ? <Spinner /> : t("submit_btn")}
      </Button>
    </form>
  );
};
