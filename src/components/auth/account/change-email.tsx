"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserQuery } from "@/hooks/use-user";
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";

export const formSchema = z.object({
  email: z.email(),
});

export function ChangeEmail() {
  const [isPending, startTransition] = useTransition();
  const t = useScopedI18n("account");

  const { data: user } = useUserQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { data, error } = await authClient.changeEmail({
        newEmail: values.email,
      });

      if (error) {
        logger.error(error);
        toast.error(error.message || "Error changing email");
        return;
      }

      if (data.status) {
        toast.success(
          "A verification email has been sent. Please check your inbox to confirm the change.",
        );
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{t("email")}</CardTitle>
          <CardDescription>{t("email.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                  placeholder="m@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>

        <CardFooter className="border-t text-muted-foreground text-sm justify-between">
          <div>{t("email.message")}</div>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : t("save")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
