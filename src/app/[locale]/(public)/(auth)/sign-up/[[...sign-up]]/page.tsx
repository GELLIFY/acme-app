import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { TermsPrivacyLinks } from "@/components/auth/terms privacy-links";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/shared/helpers/better-auth/auth";
import { getScopedI18n } from "@/shared/locales/server";

export const metadata: Metadata = {
  title: "Sign Up | Acme.",
};

export default async function SignUp() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) return redirect("/");

  const t = await getScopedI18n("auth");

  return (
    <div className="flex flex-col gap-6">
      <Card className="z-50  max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t("signup.title")}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t("signup.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-sm text-muted-foreground">
            {t("already_have_account")}{" "}
            <Link href="/sign-in" className="text-primary underline">
              {t("signin.submit_btn")}
            </Link>
          </span>
        </CardFooter>
      </Card>
      <TermsPrivacyLinks />
    </div>
  );
}
