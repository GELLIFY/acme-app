import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UsersDataTable } from "@/components/auth/admin/users-data-table";
import { UsersDataTableSkeleton } from "@/components/auth/admin/users-data-table-skeleton";
import { auth } from "@/shared/helpers/better-auth/auth";
import { HydrateClient } from "@/shared/helpers/trpc/server";

export const metadata: Metadata = {
  title: "Admin | Acme",
  description: "Admin dashboard for managing users, roles, and permissions.",
};

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ["list"] } },
  });
  if (!hasAccess.success) return redirect("/");

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
  });

  return (
    <HydrateClient>
      <main className="container mx-auto p-4 space-y-4">
        <header className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </header>

        <div className="flex justify-between items-center">
          {/* <TagsSearchFilter />
        <TagsActions /> */}
        </div>

        <Suspense fallback={<UsersDataTableSkeleton />}>
          <UsersDataTable users={users.users} />
        </Suspense>
      </main>
    </HydrateClient>
  );
}
