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
import {
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/shared/helpers/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";

export default async function TodoPage() {
  const t = await getScopedI18n("todo");

  const queryClient = getQueryClient();

  // Change this to prefetch once this is fixed: https://github.com/trpc/trpc/issues/6632
  // prefetch(trpc.todo.getAll.queryOptions());
  await queryClient.fetchQuery(trpc.todo.getAll.queryOptions());

  // Or use the caller directly without using `.prefetch()`
  // const todos = await caller.todo.getAll();

  return (
    <HydrateClient>
      <div className="mx-auto w-full max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("subtitle")}</CardDescription>
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
