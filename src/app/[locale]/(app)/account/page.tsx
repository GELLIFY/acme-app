import type { Metadata } from "next";
import { ChangeEmail } from "@/components/account/change-email";
import { ChangeTheme } from "@/components/account/change-theme";
import { DeleteAccount } from "@/components/account/delete-account";
import { DisplayName } from "@/components/account/display-name";
import { UserAvatar } from "@/components/account/user-avatar";
import { getQueryClient, trpc } from "@/shared/helpers/trpc/server";

export const metadata: Metadata = {
  title: "Account Settings | Acme",
};

export default async function AccountPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.user.me.queryOptions());

  return (
    <div className="space-y-12">
      <UserAvatar />
      <DisplayName />
      <ChangeEmail />
      <ChangeTheme />
      <DeleteAccount />
    </div>
  );
}
