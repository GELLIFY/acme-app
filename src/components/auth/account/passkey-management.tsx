"use client";

import type { Passkey } from "@better-auth/passkey";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { ArrowUpRightIcon, FingerprintIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { browserLogger } from "@/shared/infrastructure/logger/browser-logger";
import { useScopedI18n } from "@/shared/locales/client";

const passkeySchema = z.object({
  name: z.string().min(1),
  authenticatorAttachment: z.enum(["platform", "cross-platform"]).optional(),
});

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("account.security.passkey");
  const router = useRouter();

  const form = useForm<z.infer<typeof passkeySchema>>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleAddPasskey(data: z.infer<typeof passkeySchema>) {
    try {
      await authClient.passkey.addPasskey(data, {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: ({ error }) => {
          browserLogger.error(error.message, error);
          toast.error(error.message || "Failed to add passkey");
        },
        onSuccess: () => {
          router.refresh();
          setIsDialogOpen(false);
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        browserLogger.error(error.message, error);
        toast.error(error.message);
      }
    }
  }

  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => router.refresh(),
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {passkeys.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FingerprintIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty.title")}</EmptyTitle>
              <EmptyDescription>{t("empty.description")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          passkeys.map((passkey) => (
            <Item variant="outline" key={passkey.id}>
              <ItemMedia variant="icon">
                <FingerprintIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{passkey.name}</ItemTitle>
                <ItemDescription>
                  {t("created", {
                    value: new Date(passkey.createdAt).toLocaleDateString(),
                  })}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("delete_title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("delete_decription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("delete_cancel")}
                      </AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeletePasskey(passkey.id)}
                        asChild
                      >
                        <AlertDialogAction>
                          {loading ? <Spinner /> : t("delete_confirm")}
                        </AlertDialogAction>
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between gap-4">
        <Link
          href="#"
          className="gap-2 items-center"
          style={{ display: "ruby" }}
        >
          {t("info")} <ArrowUpRightIcon className="size-4" />
        </Link>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(o) => {
            if (o) form.reset();
            setIsDialogOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <Button>{t("new_btn")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("new_title")}</DialogTitle>
              <DialogDescription>{t("new_description")}</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleAddPasskey)}
              className="grid gap-4"
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input {...field} placeholder="ex. Desktop, iPhone..." />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Spinner /> : t("new_submit")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
