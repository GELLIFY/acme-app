import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { BackupCodeForm } from "@/modules/two-factor/components/backup-code-form";
import { VerifyTotpForm } from "@/modules/two-factor/components/verify-totp-form";
import { getScopedI18n } from "@/shared/locales/server";

export default async function TwoFactorPage() {
  const session = await getCachedSession();
  if (session) return redirect("/");

  const t = await getScopedI18n("account.security.two_factor");

  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{t("access.title")}</CardTitle>
          <CardDescription>{t("access.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="totp">{t("access.app_tab")}</TabsTrigger>
              <TabsTrigger value="backup">{t("access.backup_tab")}</TabsTrigger>
            </TabsList>

            <TabsContent value="totp">
              <VerifyTotpForm />
            </TabsContent>

            <TabsContent value="backup">
              <BackupCodeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
