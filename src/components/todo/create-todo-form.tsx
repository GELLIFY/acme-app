"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodoFilterParams } from "@/hooks/use-todo-filter-params";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { logger } from "@/shared/infrastructure/logger";
import { useScopedI18n } from "@/shared/locales/client";
import { createTodoSchema } from "@/shared/validators/todo.schema";
import { Field, FieldError } from "../ui/field";
import { Spinner } from "../ui/spinner";

export function CreateTodoForm() {
  const t = useScopedI18n("todo");

  const { filter } = useTodoFilterParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof createTodoSchema>>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: "" },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createTodoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    logger.info(values);
    createMutation.mutate(values);
  }

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onMutate: async (variables) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: trpc.todo.get.queryKey({ ...filter }),
        });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(
          trpc.todo.get.queryKey({ ...filter }),
        );

        // Optimistically update the cache
        queryClient.setQueryData(
          trpc.todo.get.queryKey({ ...filter }),
          (old) => {
            if (!old) return old;

            return [
              ...old,
              {
                id: "placeholder_id", // better to make this unique
                completed: false,
                text: variables.text,
              },
            ];
          },
        );

        // Return a context object with the snapshotted value
        return { previousData };
      },
      onError: (_, __, context) => {
        // If the mutation fails, use the context returned from onMutate to roll back
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.todo.get.queryKey({ ...filter }),
            context.previousData,
          );
        }
      },
      onSettled: () => {
        // Always refetch after error or success to ensure we have the latest data
        queryClient.invalidateQueries({
          queryKey: trpc.todo.get.queryKey({ ...filter }),
        });

        form.reset();
      },
    }),
  );

  return (
    <form
      className="mb-6 flex items-center space-x-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="text"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder={t("placeholder")}
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? <Spinner /> : t("add")}
      </Button>
    </form>
  );
}
