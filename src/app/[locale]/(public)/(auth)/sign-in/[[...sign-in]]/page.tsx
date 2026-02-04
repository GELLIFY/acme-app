import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PasskeyButton } from "@/components/auth/passkey-button";
import { SignInForm } from "@/components/auth/sign-in-form";
import { TermsPrivacyLinks } from "@/components/auth/terms privacy-links";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCachedSession } from "@/shared/infrastructure/better-auth/get-cached-session";
import { getScopedI18n } from "@/shared/locales/server";

export const metadata: Metadata = {
  title: "Sign In | Acme.",
};

export default async function SignIn() {
  const session = await getCachedSession();
  if (session) return redirect("/");

  const t = await getScopedI18n("auth");

  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t("signin.title")}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t("signin.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <PasskeyButton />
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            {t("no_account")}{" "}
            <Link href="/sign-up" className="text-primary underline">
              {t("signup.submit_btn")}
            </Link>
          </span>
        </CardFooter>
      </Card>
      <TermsPrivacyLinks />
    </div>
  );
}
