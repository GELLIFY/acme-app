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
  name: z.string().min(1).max(32).optional(),
});

export function DisplayName() {
  const { data: user } = useUserQuery();
  const updateUserMutation = useUserMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    updateUserMutation.mutate({
      name: data?.name,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <CardDescription>
            Please enter your full name, or a display name.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
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
          <div>Please use 32 characters at maximum.</div>
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
