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
import { browserLogger } from "@/infrastructure/logger/browser-logger";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";

const formSchema = z.object({
  name: z.string().min(1).max(32).optional(),
});

export function OrganizationName({
  canUpdateOrganization,
}: {
  canUpdateOrganization: boolean;
}) {
  const t = useScopedI18n("organization");

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: organization } = useOrganizationQuery();

  const updateOrganizationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await authClient.organization.update({
        data: values,
        organizationId: organization?.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
      browserLogger.error(error.message, error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.organization.active.queryKey(),
      });
    },
  });

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
                  disabled={!canUpdateOrganization}
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
          <Button
            type="submit"
            disabled={
              updateOrganizationMutation.isPending || !canUpdateOrganization
            }
          >
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
