import type { Metadata } from "next";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getScopedI18n } from "@/shared/locales/server";

export const metadata: Metadata = {
  title: "Reset Password | Acme.",
};

// Describe your search params, and reuse this in useQueryStates / createSerializer:
const resetPasswordSearchParams = {
  token: parseAsString,
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ResetPasswordPage(props: PageProps) {
  const t = await getScopedI18n("auth.reset_password");
  const searchParams = await props.searchParams;

  const loadParams = createLoader(resetPasswordSearchParams);
  const params = loadParams(searchParams);

  if (!params.token) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t("invalid_link_title")}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t("invalid_link_description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" className="w-full mt-2" asChild>
            <Link href="/sign-in">{t("back_btn")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("title")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={params.token} />
      </CardContent>
    </Card>
  );
}
