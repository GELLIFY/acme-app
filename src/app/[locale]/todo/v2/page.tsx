import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { createLoader } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "@/components/error-fallback";
import { CreatePostForm } from "@/components/todo/create-todo-form";
import { DataTable } from "@/components/todo/tables/data-table";
import { TodoFilters } from "@/components/todo/todo-filters";
import { TodoListLoading } from "@/components/todo/todo-list.loading";
import {
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/shared/helpers/trpc/server";
import { todoFilterParamsSchema } from "@/shared/validators/todo.schema";

type TodoPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TodoPage(props: TodoPageProps) {
  // Load search parameters
  const searchParams = await props.searchParams;
  const loadTodoFilterParams = createLoader(todoFilterParamsSchema);
  const filter = loadTodoFilterParams(searchParams);

  // Prepare query client form tRPC calls
  const queryClient = getQueryClient();
  // Change this to prefetch once this is fixed: https://github.com/trpc/trpc/issues/6632
  // prefetch(trpc.todo.getAll.queryOptions());
  await queryClient.fetchQuery(trpc.todo.getAll.queryOptions({ ...filter }));

  return (
    <HydrateClient>
      <div className="container mx-auto py-10">
        <ErrorBoundary fallbackRender={ErrorFallback}>
          <Suspense fallback={<TodoListLoading />}>
            <DataTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
