"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CopyIcon, DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useUserQuery } from "@/hooks/use-user";
import type { RouterOutput } from "@/server/api/trpc/routers/_app";
import { useTRPC } from "@/shared/helpers/trpc/client";
import {
  twoFactorSchema,
  verifyToptSchema,
} from "@/shared/validators/user.schema";

type TwoFactorData = RouterOutput["user"]["enableTwoFactor"];

function TwoFactorAuthForm({
  twoFactorEnabled,
  setTwoFactorData,
}: {
  twoFactorEnabled: boolean;
  setTwoFactorData: Dispatch<SetStateAction<TwoFactorData | undefined>>;
}) {
  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      password: "",
    },
  });

  const enable2FAMutation = useMutation(
    trpc.user.enableTwoFactor.mutationOptions({
      onError: (error) => {
        console.error(error);
        toast.error(error.message || "Failed to enable 2FA");
      },
      onSuccess: (data) => {
        setTwoFactorData(data);
        form.reset();
      },
    }),
  );

  const disable2FAMutation = useMutation(
    trpc.user.disableTwoFactor.mutationOptions({
      onError: (error) => {
        console.error(error);
        toast.error(error.message || "Failed to disable 2FA");
      },
      onSuccess: () => {
        form.reset();
        router.refresh();
      },
    }),
  );

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((data) => {
        if (twoFactorEnabled) disable2FAMutation.mutate(data);
        else enable2FAMutation.mutate(data);
      })}
    >
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
      <Button
        type="submit"
        disabled={enable2FAMutation.isPending || disable2FAMutation.isPending}
      >
        {enable2FAMutation.isPending || disable2FAMutation.isPending ? (
          <Spinner />
        ) : twoFactorEnabled ? (
          "Disable"
        ) : (
          "Enable"
        )}
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
  const router = useRouter();
  const trpc = useTRPC();

  const verifyToptMutation = useMutation(
    trpc.user.verifyTopt.mutationOptions({
      onError: (error) => {
        toast.error(error.message || "Failed to verify code");
      },
      onSuccess: () => {
        setSuccessfullyEnabled(true);
        router.refresh();
      },
    }),
  );

  const form = useForm<z.infer<typeof verifyToptSchema>>({
    resolver: zodResolver(verifyToptSchema),
    defaultValues: { code: "", trustDevice: true },
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((data) => verifyToptMutation.mutate(data))}
    >
      <Controller
        name="code"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="code">Code</FieldLabel>
            <FieldDescription>
              Scan this QR code with your authenticator app and enter the code
              below:
            </FieldDescription>
            <QRCode
              size={216}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={twoFactorData.totpURI}
            />
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
      <Button
        type="submit"
        disabled={verifyToptMutation.isPending}
        className="w-full"
      >
        {verifyToptMutation.isPending ? <Spinner /> : "Submit"}
      </Button>
    </form>
  );
}

export function TwoFactor() {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData>();
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);

  const { data: user } = useUserQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Enable or disable 2FA to add an extra layer of security.
        </CardDescription>
        <CardAction>
          <Badge variant={user.twoFactorEnabled ? "default" : "secondary"}>
            {user.twoFactorEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        {!twoFactorData && !successfullyEnabled && (
          <TwoFactorAuthForm
            twoFactorEnabled={user.twoFactorEnabled ?? false}
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
                onClick={() => setTwoFactorData(undefined)}
              >
                <DownloadIcon />
                Download
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setTwoFactorData(undefined)}
              >
                <CopyIcon />
                Copy
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => setTwoFactorData(undefined)}
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
