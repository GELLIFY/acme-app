"use client";

import type z from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { createTodoSchema } from "@/shared/validators/todo.schema";

export function CreatePostForm() {
  const t = useScopedI18n("todo");

  // 1. Define your form.
  const form = useForm<z.infer<typeof createTodoSchema>>({
    resolver: standardSchemaResolver(createTodoSchema),
    defaultValues: { text: "", completed: false },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createTodoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createMutation.mutate(values);
  }

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.todo.get.queryFilter());
        form.reset();
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        className="mb-6 flex items-center space-x-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("placeholder")}
                  disabled={createMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            t("add")
          )}
        </Button>
      </form>
    </Form>
  );
}
