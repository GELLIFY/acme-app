"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
  logo: z
    .file()
    .min(1) // 1 byte
    .max(1024 * 1024) // 1 MB
    .mime([
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/gif",
    ])
    .nullable(),
});

export function CreateOrganizationForm() {
  const [imagePreview, setImagePreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useScopedI18n("organization");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const checkSlugMutation = useMutation({
    mutationFn: async ({ slug }: { slug: string }) => {
      const { error } = await authClient.organization.checkSlug({
        slug,
      });

      return error
        ? form.setError("slug", { message: error.message })
        : form.clearErrors("slug");
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
        logo: values.logo ? await convertImageToBase64(values.logo) : "",
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
      form.reset({ name: "", slug: "", logo: null });
    },
  });

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: null,
    },
  });

  const onSubmit = (values: z.infer<typeof createOrganizationSchema>) => {
    createOrganizationMutation.mutate(values);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 grid">
      <Controller
        name="logo"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>{t("create.logo")}</FieldLabel>
            <div className="flex items-center gap-3">
              <Avatar
                className="group size-12 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <AvatarImage
                  className="transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-20"
                  src={imagePreview}
                />
                <AvatarFallback className="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:scale-95 [@media(hover:hover)_and_(pointer:fine)]:opacity-80 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100">
                  <UploadIcon className="size-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("create.logo_upload")}
                  </Button>
                  {imagePreview && (
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => {
                        form.resetField("logo");
                        setImagePreview(undefined);
                      }}
                    >
                      <XIcon className="cursor-pointer" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("create.logo_description")}
                </p>
              </div>

              <Input
                accept="image/*"
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple={false}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  field.onChange(file);
                  handleImageChange(e);
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
            <Input
              {...field}
              onChange={(e) => {
                field.onChange(e);

                // automatic slug only if slug input is empty
                if (!form.getFieldState("slug").isDirty) {
                  const newValue = e.target.value;
                  const slugifyValue = z.string().slugify().parse(newValue);
                  form.setValue("slug", slugifyValue);
                }
              }}
              id="organization_name"
              placeholder={t("create.name_placeholder")}
            />
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
                placeholder={t("create.slug_placeholder")}
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
                ) : (
                  !fieldState.error && <CheckIcon />
                )}
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        className="justify-self-end mt-4"
        disabled={createOrganizationMutation.isPending}
      >
        {createOrganizationMutation.isPending ? (
          <Spinner />
        ) : (
          t("create.submit")
        )}
      </Button>
    </form>
  );
}
