"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  code: z.string().min(1),
  disableSession: z.boolean().optional(),
  trustDevice: z.boolean().optional(),
});

export function BackupCodeForm() {
  const [isPending, startTranstion] = useTransition();

  const t = useScopedI18n("account.security.two_factor");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      disableSession: undefined,
      trustDevice: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTranstion(async () => {
      try {
        const { data, error } = await authClient.twoFactor.verifyBackupCode({
          code: values.code,
          disableSession: values.disableSession,
          trustDevice: values.trustDevice,
        });

        if (error) {
          logger.error(error, error.message);
          toast.error(error.message || t("backup_code_form.error"));
          return;
        }

        if (data) router.push("/");
      } catch (error) {
        if (error instanceof APIError) {
          logger.error(error, error.message);
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="code">
              {t("backup_code_form.code_fld")}
            </FieldLabel>
            <Input {...field} id="code" aria-invalid={fieldState.invalid} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : t("backup_code_form.submit_btn")}
      </Button>
    </form>
  );
}
