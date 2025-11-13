"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { changePasswordSchema } from "@/shared/validators/user.schema";

export function UpdatePassword() {
  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const changePasswordMutation = useMutation(
    trpc.user.changePassword.mutationOptions({
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Password changed");
        router.push("/sign-in");
      },
    }),
  );

  const onSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password for improved security.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="current_password">
                      Current Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="current_password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new_password">New Password</FieldLabel>
                    <Input
                      {...field}
                      id="new_password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      autoComplete="new-password"
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="revokeOtherSessions"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="horizontal"
                  >
                    <Checkbox
                      id="revoke"
                      name={field.name}
                      aria-invalid={fieldState.invalid}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                      }}
                    />
                    <FieldLabel htmlFor="revoke">
                      Log out other sessions
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="border-t text-muted-foreground text-sm justify-between">
          <div>New password should be different</div>
          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? <Spinner /> : "Salva"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
