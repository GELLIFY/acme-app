import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
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
  token: parseAsString.withDefault(""),
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ResetPasswordPage(props: PageProps) {
  const t = await getScopedI18n("auth");
  const searchParams = await props.searchParams;

  const loadParams = createLoader(resetPasswordSearchParams);
  const params = loadParams(searchParams);

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("reset.title")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("reset.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={params.token} />
      </CardContent>
    </Card>
  );
}
