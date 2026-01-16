"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIError } from "better-auth";
import {
  ArrowUpRightIcon,
  CopyIcon,
  DownloadIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { browserLogger as logger } from "@/shared/infrastructure/logger/browser-logger";
import { useTRPC } from "@/shared/infrastructure/trpc/client";
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
  onSuccessfullyDisabled,
}: {
  twoFactorEnabled: boolean;
  setTwoFactorData: Dispatch<SetStateAction<TwoFactorData | null>>;
  onSuccessfullyDisabled: () => void;
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
          onSuccessfullyDisabled();
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
              autoComplete="current-password"
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
      if (error instanceof APIError) {
        logger.error(error.message, error);
        toast.error(error.message);
      }
    }
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldDescription>{t("code_msg")}</FieldDescription>
            <div className="my-4 bg-white p-6 border-dashed border rounded-lg flex justify-center">
              <QRCode size={128} value={twoFactorData.totpURI} />
            </div>
            <FieldLabel htmlFor="code">{t("code_fld")}</FieldLabel>
            <InputOTP maxLength={6} {...field} id="code" autoFocus>
              <InputOTPGroup className="grid w-full grid-cols-6 gap-4 *:data-[slot=input-otp-slot]:aspect-square *:data-[slot=input-otp-slot]:size-full *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    } catch (error) {
      logger.error("Failed to download backup codes", error as Error);
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
      logger.error("Failed to copy backup codes", error as Error);
      toast.error("Failed to copy backup codes");
    }
  };

  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.user.me.queryOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              {user?.twoFactorEnabled ? (
                <ShieldCheckIcon />
              ) : (
                <ShieldAlertIcon />
              )}
            </EmptyMedia>
            <EmptyTitle>
              {user?.twoFactorEnabled
                ? t("status.enabled_title")
                : t("status.disabled_title")}
            </EmptyTitle>
            <EmptyDescription>
              {user?.twoFactorEnabled
                ? t("status.enabled_description")
                : t("status.disabled_description")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between gap-4">
        <Link
          href="#"
          className="gap-2 items-center"
          style={{ display: "ruby" }}
        >
          {t("info")} <ArrowUpRightIcon className="size-4" />
        </Link>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              {user?.twoFactorEnabled ? t("disable") : t("enable")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">Set up 2FA</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            {!twoFactorData && !successfullyEnabled && (
              <TwoFactorAuthForm
                twoFactorEnabled={user?.twoFactorEnabled ?? false}
                setTwoFactorData={setTwoFactorData}
                onSuccessfullyDisabled={() => setIsDialogOpen(false)}
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
                <p className="text-sm text-muted-foreground">
                  {t("backup_msg")}
                </p>
                <div className="grid grid-cols-2 gap-2 my-4">
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
                    {t("download")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      void copyBackupCodes();
                    }}
                  >
                    <CopyIcon />
                    {t("copy")}
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      setTwoFactorData(null);
                      setSuccessfullyEnabled(false);
                      setIsDialogOpen(false);
                    }}
                  >
                    {t("done")}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
