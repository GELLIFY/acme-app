import type { SearchParams } from "nuqs/server";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error-fallback";
import TasksTable from "@/components/tasks/tasks-table";
import {
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/shared/helpers/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";
import { tasksFilterParamsSchema } from "@/shared/validators/tasks.schema";

type TodoPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TaskPage(props: TodoPageProps) {
  // Get scoped translations for i18n
  const t = await getScopedI18n("tasks");

  // Load search parameters
  const searchParams = await props.searchParams;
  const loadTasksFilterParams = createLoader(tasksFilterParamsSchema);
  const filter = loadTasksFilterParams(searchParams);

  // Prefetch data on the server, they will be hydated on the client
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tasks.get.queryOptions({ ...filter }));
  await queryClient.prefetchQuery(trpc.user.get.queryOptions());

  return (
    <HydrateClient>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div>{t("fallback")}</div>}></Suspense>
          <TasksTable />
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
