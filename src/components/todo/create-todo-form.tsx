"use client";

import type z from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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
import { trpc } from "@/shared/helpers/trpc/client";
import { createTodoSchema } from "@/shared/validators/post.schema";

export function CreatePostForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof createTodoSchema>>({
    resolver: standardSchemaResolver(createTodoSchema),
    defaultValues: { text: "" },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createTodoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createMutation.mutate(values);
  }

  const utils = trpc.useUtils();

  const createMutation = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.invalidate();
      form.reset();
    },
  });

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
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Add a new task..."
                  disabled={createMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={createMutation.isPending || !form.formState.isValid}
        >
          {createMutation.isPending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </form>
    </Form>
  );
}
