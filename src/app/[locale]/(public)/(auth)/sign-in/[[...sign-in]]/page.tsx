import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
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
  title: "Sign In | Acme.",
};

export default async function SignIn() {
  const t = await getScopedI18n("auth");

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          {t("signin.title")}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("signin.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-sm text-muted-foreground">
          {t("no_account")}{" "}
          <Link href="/sign-up" className="text-primary underline">
            {t("signup.submit")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
