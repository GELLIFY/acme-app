"use client";

import { Trash2Icon } from "lucide-react";

import { trpc } from "@/shared/helpers/trpc/client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export function TodoList() {
  const { data, refetch } = trpc.todo.getAll.useQuery();

  // const [data] = trpc.useSuspenseQueries((t) => [t.todo.getAll()]);

  const toggleMutation = trpc.todo.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteMutation = trpc.todo.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
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
  );
}
