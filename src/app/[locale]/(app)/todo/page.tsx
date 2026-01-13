import type { SearchParams } from "nuqs/server";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "@/components/error-fallback";
import { CreateTodoForm } from "@/components/todo/create-todo-form";
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
} from "@/infrastructure/trpc/server";
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

  // Prefetch data on the server, they will be hydated on the client
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.todo.get.queryOptions({ ...filter }));
  // Or use the caller directly to get the actual data
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
            <CreateTodoForm />
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
