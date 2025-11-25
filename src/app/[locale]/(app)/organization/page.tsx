import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationCard } from "@/components/auth/organization/organization-card";
import { auth } from "@/shared/helpers/better-auth/auth";

export const metadata: Metadata = {
  title: "Organization | Acme",
  description: "Describe the organization dashboard.",
};

export default async function OrganizationPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return redirect("/sign-in");

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  return (
    <main className="container mx-auto p-4 space-y-4">
      <OrganizationCard activeOrganization={organization} session={session} />
    </main>
  );
}
