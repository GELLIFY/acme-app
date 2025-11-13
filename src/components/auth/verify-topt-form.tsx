"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { verifyToptSchema } from "@/shared/validators/user.schema";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Spinner } from "../ui/spinner";

export function VerifyToptForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof verifyToptSchema>) => {
    try {
      await authClient.twoFactor.verifyTotp(data, {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify code");
        },
        onSuccess: () => {
          router.push("/");
        },
      });
    } catch (error) {
      // catch the error
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const form = useForm<z.infer<typeof verifyToptSchema>>({
    resolver: zodResolver(verifyToptSchema),
    defaultValues: { code: "", trustDevice: false },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="code">Code</FieldLabel>

            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Spinner /> : "Submit"}
      </Button>
    </form>
  );
}
