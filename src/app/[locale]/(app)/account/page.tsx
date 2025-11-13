import { KeyIcon, LockIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { ChangeEmail } from "@/components/auth/account/change-email";
import { DeleteAccount } from "@/components/auth/account/delete-account";
import { DisplayName } from "@/components/auth/account/display-name";
import { SessionManagement } from "@/components/auth/account/session-managment";
import { TwoFactor } from "@/components/auth/account/two-factor";
import { UpdatePassword } from "@/components/auth/account/update-password";
import { UserAvatar } from "@/components/auth/account/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQueryClient, trpc } from "@/shared/helpers/trpc/server";

export const metadata: Metadata = {
  title: "Account | Acme",
};

export default async function AccountPage() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(trpc.user.me.queryOptions());

  return (
    <Tabs className="space-y-2" defaultValue="profile">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">
          <UserIcon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="security">
          <LockIcon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">Security</span>
        </TabsTrigger>
        <TabsTrigger value="tab-3">
          <KeyIcon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">Api Keys</span>
        </TabsTrigger>
        <TabsTrigger value="danger">
          <LockIcon size={16} aria-hidden="true" />
          <span className="max-sm:hidden">Danger</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div className="text-muted-foreground space-y-4">
          <UserAvatar />
          <DisplayName />
          <ChangeEmail />
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="text-muted-foreground space-y-4">
          <UpdatePassword />
          <TwoFactor />
          <SessionManagement />
        </div>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground space-y-4">Content for Tab 3</p>
      </TabsContent>
      <TabsContent value="danger">
        <DeleteAccount />
      </TabsContent>
    </Tabs>
  );
}
