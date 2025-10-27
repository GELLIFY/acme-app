"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { useUserMutation, useUserQuery } from "@/hooks/use-user";
import { useScopedI18n } from "@/shared/locales/client";

const formSchema = z.object({
  email: z.email(),
});

export function ChangeEmail() {
  const t = useScopedI18n("account");

  const { data: user } = useUserQuery();
  const updateUserMutation = useUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateUserMutation.mutate({
      email: data.email,
    });
  });

  return (
    <form onSubmit={onSubmit}>
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
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <p> {t("save")} </p>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
