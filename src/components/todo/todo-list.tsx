"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { useTodoFilterParams } from "@/hooks/use-todo-filter-params";
import { useTRPC } from "@/shared/helpers/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export function TodoList() {
  const t = useScopedI18n("todo");

  const { filter } = useTodoFilterParams();

  const trpc = useTRPC();
  const { data, refetch } = useSuspenseQuery(
    trpc.todo.get.queryOptions({ ...filter }),
  );

  const toggleMutation = useMutation(
    trpc.todo.update.mutationOptions({
      onSuccess: () => {
        void refetch();
      },
      onError: ({ message }) => {
        void toast.error(message);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => {
        void refetch();
      },
      onError: ({ message }) => {
        void toast.error(message);
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-2">
        {data?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between rounded-md border p-2"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() =>
                  toggleMutation.mutate({
                    id: todo.id,
                    completed: !todo.completed,
                  })
                }
                id={`todo-${todo.id}`}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`${todo.completed ? "text-muted-foreground line-through" : ""}`}
              >
                {todo.text}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate({ id: todo.id })}
              aria-label="Delete todo"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
      <span className="text-right text-muted-foreground">
        {t("items", { count: data.length })}
      </span>
    </div>
  );
}
