import type { Metadata } from "next";
import { ChangeEmail } from "@/components/auth/account/change-email";
import { DeleteAccount } from "@/components/auth/account/delete-account";
import { DisplayName } from "@/components/auth/account/display-name";
import { UserAvatar } from "@/components/auth/account/user-avatar";
import { getQueryClient, trpc } from "@/shared/helpers/trpc/server";

export const metadata: Metadata = {
  title: "Account Settings | Acme",
};

export default async function AccountPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.user.me.queryOptions());

  return (
    <div className="space-y-8">
      <UserAvatar />
      <DisplayName />
      <ChangeEmail />
      <DeleteAccount />
    </div>
  );
}
