import { all } from "better-all";
import { KeyIcon, LockIcon, TriangleAlertIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApiKeyManagement } from "@/components/auth/account/api-key-management";
import { ChangeEmail } from "@/components/auth/account/change-email";
import { DeleteAccount } from "@/components/auth/account/delete-account";
import { DisplayName } from "@/components/auth/account/display-name";
import { PasskeyManagement } from "@/components/auth/account/passkey-management";
import { SessionManagement } from "@/components/auth/account/session-managment";
import { TwoFactor } from "@/components/auth/account/two-factor";
import { UpdatePassword } from "@/components/auth/account/update-password";
import { UserAvatar } from "@/components/auth/account/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/shared/infrastructure/better-auth/auth";
import { getCachedSession } from "@/shared/infrastructure/better-auth/get-cached-session";
import {
  getQueryClient,
  HydrateClient,
  trpc,
} from "@/shared/infrastructure/trpc/server";
import { getScopedI18n } from "@/shared/locales/server";

export const metadata: Metadata = {
  title: "Account | Acme",
};

export default async function AccountPage() {
  const session = await getCachedSession();
  if (!session) return redirect("/sign-in");

  // prefetch user
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.user.me.queryOptions());

  // parallel get user data
  const { sessions, passkeys, apiKeys } = await all({
    async headersList() {
      return await headers();
    },
    async sessions() {
      return auth.api.listSessions({ headers: await this.$.headersList });
    },
    async passkeys() {
      return auth.api.listPasskeys({ headers: await this.$.headersList });
    },
    async apiKeys() {
      return auth.api.listApiKeys({ headers: await this.$.headersList });
    },
  });

  // get translations
  const t = await getScopedI18n("account");

  return (
    <HydrateClient>
      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <UserIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <LockIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("security")}</span>
          </TabsTrigger>
          <TabsTrigger value="api_keys">
            <KeyIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("api_keys")}</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <TriangleAlertIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("danger")}</span>
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
            <PasskeyManagement passkeys={passkeys} />
            <SessionManagement
              sessions={sessions}
              currentSession={session.session}
            />
          </div>
        </TabsContent>
        <TabsContent value="api_keys">
          <ApiKeyManagement apiKeys={apiKeys} />
        </TabsContent>
        <TabsContent value="danger">
          <DeleteAccount />
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
