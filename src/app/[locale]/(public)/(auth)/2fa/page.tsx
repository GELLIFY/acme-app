import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BackupCodeForm } from "@/components/auth/backup-code-form";
import { VerifyTotpForm } from "@/components/auth/verify-totp-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/shared/helpers/better-auth/auth";

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) return redirect("/");

  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="totp">Authenticator</TabsTrigger>
              <TabsTrigger value="backup">Backup Code</TabsTrigger>
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
