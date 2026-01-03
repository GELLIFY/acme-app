"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";
import { verifyTotpSchema } from "@/shared/validators/user.schema";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Spinner } from "../ui/spinner";

export function VerifyTotpForm() {
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("account.security.two_factor");
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof verifyTotpSchema>) => {
    try {
      await authClient.twoFactor.verifyTotp(data, {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: ({ error }) => {
          logger.error(error, error.message);
          toast.error(error.message || "Failed to verify code");
        },
        onSuccess: () => {
          router.push("/");
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        logger.error(error, error.message);
        toast.error(error.message);
      }
    }
  };

  const form = useForm<z.infer<typeof verifyTotpSchema>>({
    resolver: zodResolver(verifyTotpSchema),
    defaultValues: { code: "", trustDevice: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="code">{t("code_fld")}</FieldLabel>

            <InputOTP maxLength={6} {...field} autoFocus>
              <InputOTPGroup className="grid w-full grid-cols-3 gap-2 *:data-[slot=input-otp-slot]:aspect-square *:data-[slot=input-otp-slot]:size-full *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="grid w-full grid-cols-3 gap-2 *:data-[slot=input-otp-slot]:aspect-square *:data-[slot=input-otp-slot]:size-full *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>{t("code_msg")}</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Spinner /> : t("verify")}
      </Button>
    </form>
  );
}
