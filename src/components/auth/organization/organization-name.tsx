"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useOrganizationQuery } from "@/hooks/use-organization";
import { browserLogger as logger } from "@/infrastructure/logger/browser-logger";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

const formSchema = z.object({
  name: z.string().min(1).max(32).optional(),
});

export function OrganizationName() {
  const t = useScopedI18n("organization");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: organization } = useOrganizationQuery();

  const updateOrganizationMutation = useMutation(
    trpc.organization.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
        logger.error(error.message, new Error(error.message));
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.organization.active.queryKey(),
        });

        toast.success(t("name.updated"));
      },
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization?.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateOrganizationMutation.mutateAsync({
      name: values.name,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("name.title")}</CardTitle>
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
                  placeholder={t("name.placeholder")}
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
          <Button type="submit" disabled={updateOrganizationMutation.isPending}>
            {updateOrganizationMutation.isPending ? (
              <Spinner />
            ) : (
              t("common.save")
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
