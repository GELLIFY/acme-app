import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
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
  title: "Forgot Password | Acme.",
};

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) return redirect("/");

  const t = await getScopedI18n("auth");

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          {t("forgot.title")}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("forgot.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-sm text-muted-foreground">
          {t("account")}{" "}
          <Link href="/sign-in" className="text-primary underline">
            {t("signin.submit")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
