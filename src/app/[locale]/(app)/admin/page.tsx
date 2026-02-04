import { all } from "better-all";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateUserDialog } from "@/components/auth/admin/create-user-dialog";
import { DataTable } from "@/components/auth/admin/data-table";
import { Filters } from "@/components/auth/admin/filters";
import { auth } from "@/shared/infrastructure/better-auth/auth";
import { getCachedSession } from "@/shared/infrastructure/better-auth/get-cached-session";
import { loadFilters } from "./search-params";

export const metadata: Metadata = {
  title: "Admin | Acme",
  description: "Admin dashboard for managing users, roles, and permissions.",
};

export default async function AdminPage({
  searchParams,
}: PageProps<"/[locale]/admin">) {
  // parallel get session and user permission
  const { headersList, session, userHasPermission } = await all({
    async headersList() {
      return await headers();
    },
    async session() {
      return getCachedSession();
    },
    async userHasPermission() {
      return auth.api.userHasPermission({
        headers: await this.$.headersList,
        body: { permission: { user: ["list"] } },
      });
    },
  });

  if (!session) return redirect("/sign-in");
  if (!userHasPermission.success) return redirect("/");

  const filters = await loadFilters(searchParams);

  const users = await auth.api.listUsers({
    headers: headersList,
    query: {
      limit: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
      searchField: "name",
      searchOperator: "contains",
      searchValue: filters.query,
    },
  });

  return (
    <main className="container mx-auto p-4 space-y-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
      </header>

      <div className="flex justify-between items-center gap-4">
        <Filters />
        <CreateUserDialog />
      </div>

      <DataTable data={users.users} />
    </main>
  );
}
