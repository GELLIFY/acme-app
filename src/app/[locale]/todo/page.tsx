import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { createLoader } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "@/components/error-fallback";
import { CreatePostForm } from "@/components/todo/create-todo-form";
import { TodoFilters } from "@/components/todo/todo-filters";
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
import { todoFilterParamsSchema } from "@/shared/validators/todo.schema";

type TodoPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TodoPage(props: TodoPageProps) {
  // Get scoped translations for i18n
  const t = await getScopedI18n("todo");

  // Load search parameters
  const searchParams = await props.searchParams;
  const loadTodoFilterParams = createLoader(todoFilterParamsSchema);
  const filter = loadTodoFilterParams(searchParams);

  // Prepare query client form tRPC calls
  const queryClient = getQueryClient();
  // Change this to prefetch once this is fixed: https://github.com/trpc/trpc/issues/6632
  // prefetch(trpc.todo.getAll.queryOptions());
  await queryClient.fetchQuery(trpc.todo.get.queryOptions({ ...filter }));
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
            <TodoFilters />
            <ErrorBoundary fallbackRender={ErrorFallback}>
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
