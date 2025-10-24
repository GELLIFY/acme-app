import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
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
  title: "Sign Up | Acme.",
};

export default async function SignUp() {
  const t = await getScopedI18n("auth");

  return (
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
          {t("account")}{" "}
          <Link href="/sign-in" className="text-primary underline">
            {t("signin.submit")}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
