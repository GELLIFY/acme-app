"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const SignInForm = () => {
  const [loading, startTransition] = useTransition();
  const [returnTo] = useQueryState("return_to");

  const router = useRouter();
  const t = useScopedI18n("auth.signin");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const { data, error } = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.log(error.message, error.status);
          toast.error(error.message);
          return;
        }

        if ("twoFactorRedirect" in data) router.push("/2fa");
        else router.push(returnTo ? `/${returnTo}` : "/");
      } catch (error) {
        if (error instanceof APIError) {
          console.log(error.message, error.status);
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                autoComplete="email webauthn"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  {t("forgot")}
                </Link>
              </div>
              <Input
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                type="password"
                placeholder="password"
                autoComplete="current-password webauthn"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <Spinner /> : <p> {t("submit")} </p>}
        </Button>
      </FieldGroup>
    </form>
  );
};
