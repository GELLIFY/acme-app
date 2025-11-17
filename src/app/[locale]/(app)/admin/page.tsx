import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/auth/admin/data-table";
import { Filters } from "@/components/auth/admin/filters";
import { auth } from "@/shared/helpers/better-auth/auth";
import { loadFilters } from "./search-params";

export const metadata: Metadata = {
  title: "Admin | Acme",
  description: "Admin dashboard for managing users, roles, and permissions.",
};

export default async function AdminPage({
  searchParams,
}: PageProps<"/[locale]/admin">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");

  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ["list"] } },
  });
  if (!hasAccess.success) return redirect("/");

  const filters = await loadFilters(searchParams);

  const users = await auth.api.listUsers({
    headers: await headers(),
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

      <div className="flex justify-between items-center">
        <Filters />
      </div>

      <DataTable data={users.users} />
    </main>
  );
}
