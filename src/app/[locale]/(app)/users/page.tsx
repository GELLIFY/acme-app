import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "@/components/error-fallback";
import UsersTable from "@/components/users/users-table";
import {
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/shared/helpers/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";

export default async function UsersPage() {
  // Get scoped translations for i18n
  const t = await getScopedI18n("users");

  // Prefetch data on the server, they will be hydrated on the client
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.user.get.queryOptions());

  return (
    <HydrateClient>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div>{t("fallback")}</div>}>
            <UsersTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
