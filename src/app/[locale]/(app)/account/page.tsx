import { all } from "better-all";
import { LockIcon, TriangleAlertIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ChangeEmail } from "@/components/auth/account/change-email";
import { DeleteAccount } from "@/components/auth/account/delete-account";
import { DisplayName } from "@/components/auth/account/display-name";
import { SessionManagement } from "@/components/auth/account/session-managment";
import { TwoFactor } from "@/components/auth/account/two-factor";
import { UpdatePassword } from "@/components/auth/account/update-password";
import { UserAvatar } from "@/components/auth/account/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/libs/better-auth/auth";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { getQueryClient, HydrateClient, trpc } from "@/libs/trpc/server";
import { accountSecurityModules } from "@/modules/account-security";
import { accountTabModules } from "@/modules/account-tab";
import { slotsOf, tabsOf } from "@/modules/registry";
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
  const { sessions } = await all({
    async headersList() {
      return await headers();
    },
    async sessions() {
      return auth.api.listSessions({ headers: await this.$.headersList });
    },
  });

  // get translations
  const t = await getScopedI18n("account");

  const tabs = tabsOf(accountTabModules);

  return (
    <HydrateClient>
      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${3 + tabs.length}, minmax(0, 1fr))`,
          }}
        >
          <TabsTrigger value="profile">
            <UserIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <LockIcon size={16} aria-hidden="true" />
            <span className="max-sm:hidden">{t("security")}</span>
          </TabsTrigger>
          {tabs.map(({ id, value, Trigger }) => (
            <TabsTrigger key={id} value={value}>
              <Trigger />
            </TabsTrigger>
          ))}
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
            {slotsOf(accountSecurityModules).map(({ id, Component }) => (
              <Component key={id} />
            ))}
            <SessionManagement
              sessions={sessions}
              currentSession={session.session}
            />
          </div>
        </TabsContent>
        {tabs.map(({ id, value, Component }) => (
          <TabsContent key={id} value={value}>
            <Component />
          </TabsContent>
        ))}
        <TabsContent value="danger">
          <DeleteAccount />
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
