"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2Icon, CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { browserLogger } from "@/infrastructure/logger/browser-logger";
import { authClient } from "@/libs/better-auth/auth-client";
import { useTRPC } from "@/libs/trpc/client";
import { convertImageToBase64 } from "@/shared/helpers/image";
import { useScopedI18n } from "@/shared/locales/client";

const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(64),
  slug: z.string().trim().slugify().min(2).max(64),
  logo: z.string().optional(),
});

export function CreateOrganizationForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useScopedI18n("organization");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const checkSlugMutation = useMutation({
    mutationFn: async ({ slug }: { slug: string }) => {
      const { data, error } = await authClient.organization.checkSlug({
        slug,
      });

      if (error) {
        if (error.code === "SLUG_IS_TAKEN") {
          return form.setError("slug", {
            message: t("create.slugExists"),
          });
        } else {
          throw new Error(error.message || t("messages.error"));
        }
      }

      form.clearErrors("slug");
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
      browserLogger.error(error.message, error);
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof createOrganizationSchema>) => {
      const { data, error } = await authClient.organization.create({
        name: values.name,
        slug: values.slug,
        logo: values.logo || undefined,
        keepCurrentActiveOrganization: true,
      });

      if (error) {
        throw new Error(error.message || t("messages.error"));
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
      browserLogger.error(error.message, error);
    },
    onSuccess: () => {
      // invalidate organization list query
      queryClient.invalidateQueries({
        queryKey: trpc.organization.list.queryKey(),
      });

      toast.success(t("messages.created"));
      form.reset({ name: "", slug: "", logo: "" });
    },
  });

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createOrganizationSchema>) => {
    createOrganizationMutation.mutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="logo"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("create.logo")}</FieldLabel>
            <div className="flex items-center gap-3">
              <Avatar
                className="size-12 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <AvatarImage src={field.value || undefined} />
                <AvatarFallback>
                  <Building2Icon className="size-4" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {t("create.logo_description")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon />
                  {t("create.logo_upload")}
                </Button>
              </div>

              <Input
                accept="image/*"
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                multiple={false}
                onChange={async (event) => {
                  const file = event.target.files?.[0] ?? null;
                  const image = file ? await convertImageToBase64(file) : "";
                  field.onChange(image);
                }}
              />
            </div>
          </Field>
        )}
      />

      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="organization_name">
              {t("create.name")}
            </FieldLabel>
            <Input {...field} id="organization_name" placeholder="Acme Inc" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="organization_slug">
              {t("create.slug")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="organization_slug"
                placeholder="acme-inc"
                value={field.value}
                onChange={async (e) => {
                  field.onChange(e);

                  await checkSlugMutation.mutateAsync({
                    slug: e.target.value,
                  });
                }}
              />
              <InputGroupAddon align="inline-end">
                {checkSlugMutation.isPending ? (
                  <Spinner />
                ) : fieldState.error ? (
                  <XIcon className="text-red-600" />
                ) : (
                  <CheckIcon className="text-green-600" />
                )}
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>{t("create.hint")}</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={createOrganizationMutation.isPending}>
        {createOrganizationMutation.isPending ? (
          <Spinner />
        ) : (
          t("create.submit")
        )}
      </Button>
    </form>
  );
}
