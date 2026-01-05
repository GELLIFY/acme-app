"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { APIError } from "better-auth";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { convertImageToBase64 } from "@/shared/helpers/image";
import { authClient } from "@/shared/infrastructure/better-auth/auth-client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const formSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8).max(32),
    passwordConfirmation: z.string().min(8).max(32),
    image: z
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
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.passwordConfirmation) {
      ctx.issues.push({
        code: "custom",
        message: "Password is not the same as confirm password",
        input: val.passwordConfirmation,
        path: ["password"],
      });
    }
  });

export const SignUpForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const t = useScopedI18n("auth.signup");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      image: null,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const { data, error } = await authClient.signUp.email({
          email: values.email,
          password: values.password,
          name: `${values.firstName} ${values.lastName}`,
          image: values.image ? await convertImageToBase64(values.image) : "",
        });

        if (error) {
          logger.error(error, error.message);
          toast.error(error.message);
          return;
        }

        if (data) {
          router.push("/");
        }
      } catch (error) {
        if (error instanceof APIError) {
          logger.error(error, error.message);
          toast.error(error.message);
        }
      }
    });
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="first-name">
                {t("first_name_fld")}
              </FieldLabel>
              <Input
                {...field}
                id="first-name"
                placeholder="Max"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="last-name">{t("last_name_fld")}</FieldLabel>
              <Input
                {...field}
                id="last-name"
                aria-invalid={fieldState.invalid}
                placeholder="Robinson"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">{t("email_fld")}</FieldLabel>
            <Input
              {...field}
              id="email"
              aria-invalid={fieldState.invalid}
              autoComplete="username"
              placeholder="m@example.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">{t("password_fld")}</FieldLabel>
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              type="password"
              placeholder="********"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="passwordConfirmation"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password_confirmation">
              {t("password_confirmation_fld")}
            </FieldLabel>
            <Input
              {...field}
              id="password_confirmation"
              aria-invalid={fieldState.invalid}
              type="password"
              placeholder="********"
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="image"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="image">{t("image_fld")}</FieldLabel>
            <div className="flex items-end gap-4">
              {imagePreview && (
                <div className="relative w-9 h-9 rounded-sm overflow-hidden">
                  <Image
                    src={imagePreview}
                    height={36}
                    width={36}
                    alt="Profile preview"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    field.onChange(file);
                    handleImageChange(e);
                  }}
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                />
                {imagePreview && (
                  <XIcon
                    className="cursor-pointer"
                    onClick={() => {
                      form.resetField("image");
                      setImagePreview(null);
                    }}
                  />
                )}
              </div>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending ? <Spinner /> : t("submit_btn")}
      </Button>
    </form>
  );
};
