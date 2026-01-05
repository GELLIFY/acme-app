"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { format, formatDistanceToNow } from "date-fns";
import { KeyIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { CopyButton } from "@/components/copy-button";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import type { auth } from "@/shared/infrastructure/better-auth/auth";
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";

type ApiKey = Awaited<ReturnType<typeof auth.api.listApiKeys>>[number];
type ApiKeyData = Awaited<ReturnType<typeof auth.api.createApiKey>>;

const EXPIRES_OPTIONS = {
  NO_EXPIRATION: 0,
  ONE_DAY: 1,
  SEVEN_DAYS: 7,
  ONE_MONTH: 30,
  TWO_MONTHS: 60,
  THREE_MONTHS: 90,
  SIX_MONTHS: 180,
  ONE_YEAR: 365,
} as const;

const apiKeySchema = z.object({
  name: z.string().min(1),
  expiresIn: z.number().optional(),
});

function CopyApiKey({
  data,
  onComplete,
}: {
  data: ApiKeyData;
  onComplete: () => void;
}) {
  const t = useScopedI18n("account.api_keys");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <FieldLabel> {t("key_lbl")}</FieldLabel>
        <div className="relative font-mono text-sm p-4 bg-accent rounded-lg pr-12 break-all">
          <CopyButton value={data.key} />
          {data.key}
        </div>
        <FieldDescription>{t("key_msg")}</FieldDescription>
      </div>
      <Button type="button" className="w-full" onClick={onComplete}>
        {t("done_btn")}
      </Button>
    </div>
  );
}

function ApiKeyForm({
  setApiKeyData,
}: {
  setApiKeyData: Dispatch<SetStateAction<ApiKeyData | null>>;
}) {
  const [loading, setLoading] = useState(false);

  const t = useScopedI18n("account.api_keys");
  const router = useRouter();

  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
      expiresIn: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof apiKeySchema>) {
    try {
      const { data, error } = await authClient.apiKey.create(
        {
          name: values.name,
          expiresIn: values.expiresIn
            ? 60 * 60 * 24 * values.expiresIn
            : undefined,
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

      if (error) {
        logger.error(error, error.message);
        toast.error(error.message);
        return;
      }

      router.refresh();
      setApiKeyData(data);
    } catch (error) {
      if (error instanceof APIError) {
        logger.error(error, error.message);
        toast.error(error.message);
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">{t("name_fld")}</FieldLabel>
              <Input {...field} id="name" placeholder="ex. GHA key" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="expiresIn"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="expires_in">{t("expires_fld")}</FieldLabel>
              <NativeSelect
                id="expires_in"
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {Object.entries(EXPIRES_OPTIONS).map(([key, value]) => (
                  <NativeSelectOption key={key} value={value}>
                    {t(`expirations.${key as keyof typeof EXPIRES_OPTIONS}`)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Spinner /> : t("create_btn")}
      </Button>
    </form>
  );
}

export function ApiKeyManagement({ apiKeys }: { apiKeys: ApiKey[] }) {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKeyData, setApiKeyData] = useState<ApiKeyData | null>(null);

  const t = useScopedI18n("account.api_keys");
  const router = useRouter();

  async function deleteApiKey(apiKey: ApiKey) {
    try {
      const { data, error } = await authClient.apiKey.delete(
        {
          keyId: apiKey.id,
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

      if (error) {
        logger.error(error, error.message);
        toast.error(error.message);
        return;
      }

      if (data.success) {
        toast.success("Api Key deleted");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof APIError) {
        logger.error(error, error.message);
        toast.error(error.message);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKeys.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyIcon />
              </EmptyMedia>
              <EmptyTitle>{t("empty.title")}</EmptyTitle>
              <EmptyDescription>{t("empty.description")}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          apiKeys?.map((apiKey) => (
            <Item variant="outline" key={apiKey.id}>
              <ItemMedia variant="icon">
                <KeyIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{apiKey.name}</ItemTitle>
                <ItemDescription className="gap-1 flex">
                  <span>
                    {t("created", {
                      date: format(apiKey.createdAt, "dd/MM/yy"),
                    })}
                  </span>
                  <span>-</span>
                  <span>
                    {apiKey.expiresAt
                      ? t("expires", {
                          distance: formatDistanceToNow(apiKey.expiresAt, {
                            addSuffix: true,
                          }),
                        })
                      : t("expirations.NO_EXPIRATION")}
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="text-muted hover:bg-destructive"
                    >
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("delete.description")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("delete.cancel_btn")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => await deleteApiKey(apiKey)}
                        disabled={loading}
                      >
                        {loading ? <Spinner /> : t("delete.submit_btn")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
      <CardFooter className="border-t text-muted-foreground text-sm justify-between gap-4">
        <div>{t("message")}</div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>{t("create_btn")}</Button>
          </DialogTrigger>
          <DialogContent className="gap-6">
            <DialogHeader>
              <DialogTitle>{t("dialog_title")}</DialogTitle>
              <DialogDescription>{t("dialog_description")}</DialogDescription>
            </DialogHeader>

            {!apiKeyData && <ApiKeyForm setApiKeyData={setApiKeyData} />}
            {apiKeyData && (
              <CopyApiKey
                data={apiKeyData}
                onComplete={() => {
                  setIsDialogOpen(false);
                  setApiKeyData(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
