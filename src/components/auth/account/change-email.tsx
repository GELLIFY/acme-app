"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUserQuery } from "@/hooks/use-user";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { changeEmailSchema } from "@/shared/validators/user.schema";

export function ChangeEmail() {
  const t = useScopedI18n("account");

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: user } = useUserQuery();

  const changeEmailMutation = useMutation(
    trpc.user.changeEmail.mutationOptions({
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Email changed");

        queryClient.invalidateQueries({
          queryKey: trpc.user.me.queryKey(),
        });
      },
    }),
  );

  const form = useForm<z.infer<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: user?.email ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    changeEmailMutation.mutate({
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
          <Button type="submit" disabled={changeEmailMutation.isPending}>
            {changeEmailMutation.isPending ? <Spinner /> : <p> {t("save")} </p>}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
