import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/shared/locales/server";

export const metadata: Metadata = {
  title: "Forgot Password | Acme.",
};

export default async function ForgotPasswordPage() {
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
          <Link href="/sign-up" className="text-primary underline">
            {t("signin.submit")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
