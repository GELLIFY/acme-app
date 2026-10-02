import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";
import { loadTodoFilters } from "../search-params";
import { CreateTodoForm } from "./create-todo-form";
import { TodoFilters } from "./todo-filters";
import { TodoList } from "./todo-list";
import { TodoListLoading } from "./todo-list.loading";

/** The page of `/todo`, whose route file only re-exports it. */
export async function TodoPage(props: PageProps<"/[locale]/todo">) {
  // auth guard
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  // get scoped translations and filters
  const [t, filter] = await Promise.all([
    getScopedI18n("todo"),
    loadTodoFilters(props.searchParams),
  ]);

  // prefetch data on the server, they will be hydated on the client
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.todo.get.queryOptions({ ...filter }));

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
