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
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useScopedI18n } from "@/shared/locales/client";

const formSchema = z.object({
  name: z.string().min(1).max(32).optional(),
});

export function DisplayName() {
  const [isPending, starTransition] = useTransition();
  const t = useScopedI18n("account");

  const { data: user } = useUserQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    starTransition(async () => {
      const { data, error } = await authClient.updateUser({
        name: values.name,
      });

      if (error) {
        console.error(error);
        toast.error(error.message || "Error updating user");
        return;
      }

      if (data.status) toast.success("User updated");
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("name")}</CardTitle>
          <CardDescription>{t("name.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Rob"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>

        <CardFooter className="border-t text-muted-foreground text-sm justify-between">
          <div>{t("name.message")}</div>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : t("save")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
