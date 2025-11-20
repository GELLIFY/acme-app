"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import type * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/shared/helpers/better-auth/auth-client";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import {
  twoFactorSchema,
  verifyTotpSchema,
} from "@/shared/validators/user.schema";

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

function TwoFactorAuthForm({
  twoFactorEnabled,
  setTwoFactorData,
}: {
  twoFactorEnabled: boolean;
  setTwoFactorData: Dispatch<SetStateAction<TwoFactorData | null>>;
}) {
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("account.security.two_factor");
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      password: "",
      issuer: "acme-app",
    },
  });

  async function handleDisable2FA(data: z.infer<typeof twoFactorSchema>) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to disable 2FA");
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.user.me.queryKey(),
          });

          form.reset();
        },
      },
    );
  }

  async function handleEnable2FA(data: z.infer<typeof twoFactorSchema>) {
    const result = await authClient.twoFactor.enable(
      {
        password: data.password,
        issuer: data.issuer,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    );

    if (result.error) {
      toast.error(result.error.message || "Failed to enable 2FA");
    }
    setTwoFactorData(result.data);
    form.reset();
  }

  const onSubmit = async (data: z.infer<typeof twoFactorSchema>) => {
    if (twoFactorEnabled) handleDisable2FA(data);
    else handleEnable2FA(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              type="password"
              autoComplete="password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : twoFactorEnabled ? t("disable") : t("enable")}
      </Button>
    </form>
  );
}

function VerifyToptForm({
  twoFactorData,
  setSuccessfullyEnabled,
}: {
  twoFactorData: TwoFactorData;
  setSuccessfullyEnabled: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("account.security.two_factor");
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof verifyTotpSchema>>({
    resolver: zodResolver(verifyTotpSchema),
    defaultValues: { code: "", trustDevice: true },
  });

  const onSubmit = async (data: z.infer<typeof verifyTotpSchema>) => {
    try {
      // Call the authClient's forgetPassword method, passing the email and a redirect URL.
      await authClient.twoFactor.verifyTotp(
        {
          code: data.code,
          trustDevice: data.trustDevice,
        },
        {
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
            queryClient.invalidateQueries({
              queryKey: trpc.user.me.queryKey(),
            });
            setSuccessfullyEnabled(true);
          },
        },
      );
    } catch (error) {
      // catch the error
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="code" className="sr-only">
              {t("code_fld")}
            </FieldLabel>
            <div className="bg-white p-6 border-dashed border rounded-lg">
              <QRCode
                size={216}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={twoFactorData.totpURI}
              />
            </div>
            <FieldDescription>{t("code_msg")}</FieldDescription>
            <InputOTP maxLength={6} {...field}>
              <InputOTPGroup className="grid w-full grid-cols-6 gap-4 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
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
        {loading ? <Spinner /> : t("verify")}
      </Button>
    </form>
  );
}

export function TwoFactor() {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);

  const t = useScopedI18n("account.security.two_factor");

  const downloadBackupCodes = () => {
    if (!twoFactorData?.backupCodes?.length) {
      toast.error("No backup codes available");
      return;
    }

    try {
      const codes = twoFactorData.backupCodes.join("\n");
      const blob = new Blob([codes], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().split("T")[0];

      link.href = url;
      link.download = `acme-2fa-backup-codes-${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup codes downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download backup codes");
    }
  };

  const copyBackupCodes = async () => {
    if (!twoFactorData?.backupCodes?.length) {
      toast.error("No backup codes available");
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      toast.error("Clipboard not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(twoFactorData.backupCodes.join("\n"));
      toast.success("Backup codes copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy backup codes");
    }
  };

  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.me.queryOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription className="col-span-2">
          {t("description")}
        </CardDescription>
        <CardAction>
          <Badge variant={user?.twoFactorEnabled ? "default" : "secondary"}>
            {user?.twoFactorEnabled ? t("enabled") : t("disabled")}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        {!twoFactorData && !successfullyEnabled && (
          <TwoFactorAuthForm
            twoFactorEnabled={user?.twoFactorEnabled ?? false}
            setTwoFactorData={setTwoFactorData}
          />
        )}
        {twoFactorData && !successfullyEnabled && (
          <VerifyToptForm
            twoFactorData={twoFactorData}
            setSuccessfullyEnabled={setSuccessfullyEnabled}
          />
        )}
        {successfullyEnabled && (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Save these backup codes in a safe place. You can use them to
              access your account.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {twoFactorData?.backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm">
                  {code}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  downloadBackupCodes();
                }}
              >
                <DownloadIcon />
                Download
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  void copyBackupCodes();
                }}
              >
                <CopyIcon />
                Copy
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  setTwoFactorData(null);
                  setSuccessfullyEnabled(false);
                }}
              >
                Done
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
