import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "@/components/error-fallback";
import { CreatePostForm } from "@/components/todo/create-todo-form";
import { TodoList } from "@/components/todo/todo-list";
import { TodoListLoading } from "@/components/todo/todo-list.loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HydrateClient, trpc } from "@/shared/helpers/trpc/server";

export const dynamic = "force-dynamic";

export default async function TodoPage() {
  void trpc.todo.getAll.prefetch();

  // Or use the caller directly without using `.prefetch()`
  // const todos = await trpc.todo.getAll();

  return (
    <HydrateClient>
      <div className="mx-auto w-full max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
            <CardDescription>Manage your tasks efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePostForm />
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<TodoListLoading />}>
                <TodoList />
              </Suspense>
            </ErrorBoundary>
          </CardContent>
        </Card>
      </div>
    </HydrateClient>
  );
}
