"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUserMutation, useUserQuery } from "@/hooks/use-user";

const formSchema = z.object({
  email: z.email(),
});

export function ChangeEmail() {
  const { data: user } = useUserQuery();
  const updateUserMutation = useUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateUserMutation.mutate({
      email: data.email,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Enter the email address you want to use to log in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="username"
                  placeholder="m@example.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </CardContent>

        <CardFooter className="border-t text-muted-foreground text-sm justify-between">
          <div>Please enter a valid email address.</div>
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <p> Save </p>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
