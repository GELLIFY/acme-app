"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

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
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const t = useScopedI18n("auth.reset");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call the authClient's reset password method, passing the email and a redirect URL.
      await authClient.resetPassword(
        {
          newPassword: values.password, // new password given by user
          token,
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            setLoading(true);
          },
          onSuccess: () => {
            toast.success("New password has been created");
            router.replace("/sign-in");
          },
          onError: (ctx) => {
            console.error(ctx.error.message);
            toast.error(ctx.error.message);
          },
        },
      );
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
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
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
              Confirm Password
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
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <Loader2Icon size={16} className="animate-spin" />
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
};
