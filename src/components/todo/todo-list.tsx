"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useTodoFilters } from "@/app/[locale]/(app)/todo/search-params";
import { useTRPC } from "@/libs/trpc/client";
import { useScopedI18n } from "@/shared/locales/client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export function TodoList() {
  const t = useScopedI18n("todo");

  const [filter] = useTodoFilters();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data, refetch } = useSuspenseQuery(
    trpc.todo.get.queryOptions({ ...filter }),
  );
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const [exitingIds, setExitingIds] = useState<Record<string, boolean>>({});
  const deleteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  useEffect(() => {
    const nextIds = data.map((todo) => todo.id);

    setVisibleIds((current) => {
      const nextVisibleIds = { ...current };
      let hasChanges = false;

      for (const id of Object.keys(nextVisibleIds)) {
        if (!nextIds.includes(id)) {
          delete nextVisibleIds[id];
          hasChanges = true;
        }
      }

      for (const id of nextIds) {
        if (nextVisibleIds[id] !== undefined) continue;
        nextVisibleIds[id] = false;
        hasChanges = true;
      }

      return hasChanges ? nextVisibleIds : current;
    });

    const frame = requestAnimationFrame(() => {
      setVisibleIds((current) => {
        const nextVisibleIds = { ...current };
        let hasChanges = false;

        for (const id of nextIds) {
          if (!nextVisibleIds[id]) {
            nextVisibleIds[id] = true;
            hasChanges = true;
          }
        }

        return hasChanges ? nextVisibleIds : current;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [data]);

  useEffect(() => {
    return () => {
      for (const timer of Object.values(deleteTimers.current)) {
        clearTimeout(timer);
      }
    };
  }, []);

  const toggleMutation = useMutation(
    trpc.todo.update.mutationOptions({
      onSuccess: () => {
        void refetch();
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({
          queryKey: trpc.todo.get.queryKey({ ...filter }),
        });

        const previousData = queryClient.getQueryData(
          trpc.todo.get.queryKey({ ...filter }),
        );

        queryClient.setQueryData(trpc.todo.get.queryKey({ ...filter }), (old) =>
          old?.filter((todo) => todo.id !== id),
        );

        return { previousData };
      },
      onSuccess: () => {
        void refetch();
      },
      onError: ({ message }, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            trpc.todo.get.queryKey({ ...filter }),
            context.previousData,
          );
        }

        toast.error(message);
      },
      onSettled: (_data, _error, variables) => {
        if (variables?.id) {
          setExitingIds((current) => {
            const nextExitingIds = { ...current };
            delete nextExitingIds[variables.id];
            return nextExitingIds;
          });
          delete deleteTimers.current[variables.id];
        }
      },
    }),
  );

  const handleDelete = (id: string) => {
    if (exitingIds[id]) return;

    setExitingIds((current) => ({ ...current, [id]: true }));

    deleteTimers.current[id] = setTimeout(() => {
      deleteMutation.mutate({ id });
    }, 180);
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-2">
        {data?.map((todo) => (
          <li
            key={todo.id}
            className={`overflow-hidden rounded-md border transition-[opacity,transform,max-height,margin,padding] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
              exitingIds[todo.id]
                ? "max-h-0 translate-y-2 opacity-0 py-0"
                : visibleIds[todo.id]
                  ? "max-h-16 translate-y-0 opacity-100"
                  : "max-h-16 translate-y-2 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() =>
                    toggleMutation.mutate({
                      ...todo,
                      completed: !todo.completed,
                    })
                  }
                  id={`todo-${todo.id}`}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                    todo.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {todo.text}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(todo.id)}
                aria-label="Delete todo"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <span className="text-right text-muted-foreground">
        {t("items", { count: data.length })}
      </span>
    </div>
  );
}
