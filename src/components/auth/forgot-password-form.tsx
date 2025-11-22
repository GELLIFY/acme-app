"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  email: z.email(),
});

export const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("auth.forgot");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.requestPasswordReset(
        {
          email: values.email, // Email to which the reset password link should be sent.
          redirectTo: "/reset-password", // URL to redirect the user after resetting the password.
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
        },
      );

      if (error) {
        console.error(error.message);
        toast.error(error.message);
        return;
      }

      if (data.status) {
        toast.success(data.message);
      }
    } catch (error) {
      if (error instanceof APIError) {
        console.log(error.message, error.status);
        toast.error(error.message);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              aria-invalid={fieldState.invalid}
              placeholder="m@example.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? <Spinner /> : <p> {t("submit")} </p>}
      </Button>
    </form>
  );
};
