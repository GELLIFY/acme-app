"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  TaskPlanningStatus,
  TaskPriority,
  TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";
import { capitalizeWords } from "@/lib/utils";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import type { TasksSchema } from "@/shared/validators/tasks.schema";
import { upsertTaskSchema } from "@/shared/validators/tasks.schema";
import { Button } from "../ui/button";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import UsersSelect from "../users/users-select";

export default function TasksForm() {
  const t = useScopedI18n("tasks");
  const params = useParams();
  const task_id = params.id as string;

  const formatter = new Intl.DateTimeFormat("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(
    trpc.tasks.getDetailsById.queryOptions({ id: task_id }),
  );
  const task_data = data[0] ?? undefined;

  const editMode = !!task_data;

  const form = useForm<TasksSchema>({
    resolver: zodResolver(upsertTaskSchema),
    defaultValues: {
      title: task_data?.title ?? "",
      userId: task_data?.userId ?? "no-user",
      workflow_status:
        (task_data?.workflow_status as TaskWorkflowStatus) ??
        TaskWorkflowStatus.OPEN,
      planning_status:
        (task_data?.planning_status as TaskPlanningStatus) ??
        TaskPlanningStatus.BACKLOG,
      priority: (task_data?.priority as TaskPriority) ?? TaskPriority.LOW,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: TasksSchema) {
    // Transform no-user to undefined before validation
    const processedValues = {
      ...values,
      userId: values.userId === "no-user" ? undefined : values.userId,
    };

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Form submitted with values:", processedValues);
    let salted_values = processedValues;
    if (editMode) {
      salted_values = {
        ...processedValues,
        id: task_data.id,
        updatedAt: new Date(),
      };
    }
    createMutation.mutate(salted_values);

    redirect("/tasks");
  }

  // const users = trpc.user.getAll.useQuery();

  const createMutation = useMutation(
    trpc.tasks.upsert.mutationOptions({
      onMutate: async (variables) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: trpc.tasks.getAll.queryKey(),
        });

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(
          trpc.tasks.getAll.queryKey(),
        );

        // Optimistically update the cache
        queryClient.setQueryData(
          trpc.tasks.getAll.queryKey(),
          (old) => {
            if (!old) return old;

            return [
              ...old,
              {
                id: variables.id ?? crypto.randomUUID(),
                userId: variables.userId ?? null,
                title: variables.title,
                workflow_status: variables.workflow_status as string,
                planning_status: variables.planning_status as string,
                priority: variables.priority as string,
                updatedAt: variables.updatedAt ?? null,
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
            trpc.tasks.getAll.queryKey(),
            context.previousData,
          );
        }
      },
      onSettled: () => {
        // Always refetch after error or success to ensure we have the latest data
        queryClient.invalidateQueries({
          queryKey: trpc.tasks.getAll.queryKey(),
        });

        form.reset();
      },
    }),
  );

  return (
    <form
      className="m-6 align-center space-y-6"
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("Form validation errors:", errors);
      })}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {editMode ? t("form.edit_task") : t("form.create_task")}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              {t("form.created_at", {
                date: task_data?.createdAt
                  ? formatter.format(new Date(task_data.createdAt))
                  : formatter.format(new Date()),
              })}
            </p>
            {task_data?.updatedAt && (
              <p>
                {t("form.updated_at", {
                  date: formatter.format(new Date(task_data?.updatedAt ?? "")),
                })}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("form.assignee")}
            </p>
            <Controller
              name="userId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="w-48">
                    <UsersSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h1 className="text-xl text-muted-foreground font-medium mb-2">
          {t("form.title")}
        </h1>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder={t("form.placeholder_title")}
                autoComplete="off"
                className="w-full text-lg py-3"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <h1 className="text-sm text-muted-foreground font-medium mb-2 text-center">
            {t("form.workflow_status")}
          </h1>
          <Controller
            name="workflow_status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {Object.values(TaskWorkflowStatus).map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {capitalizeWords(
                          option.toLowerCase().replaceAll("_", " "),
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-sm text-muted-foreground font-medium mb-2 text-center">
            {t("form.planning_status")}
          </h1>
          <Controller
            name="planning_status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {Object.values(TaskPlanningStatus).map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {capitalizeWords(
                          option.toLowerCase().replaceAll("_", " "),
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-sm text-muted-foreground font-medium mb-2 text-center">
            {t("form.priority")}
          </h1>
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="bottom">
                    {Object.values(TaskPriority).map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {capitalizeWords(
                          option.toLowerCase().replaceAll("_", " "),
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          className="mr-4"
          onClick={() => {
            form.reset();
            redirect("/tasks");
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={createMutation.isPending}
          onClick={() => {
            console.log("Button clicked");
            console.log("Form errors:", form.formState.errors);
            console.log("Form values:", form.getValues());
          }}
        >
          {createMutation.isPending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : editMode ? (
            t("save")
          ) : (
            t("create")
          )}
        </Button>
      </div>
    </form>
  );
}
