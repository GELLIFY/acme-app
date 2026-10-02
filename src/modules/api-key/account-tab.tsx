import { KeyIcon } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/libs/better-auth/auth";
import { getScopedI18n } from "@/shared/locales/server";
import { ApiKeyManagement } from "./components/api-key-management";

async function ApiKeyTrigger() {
  const t = await getScopedI18n("account.api_keys");
  return (
    <>
      <KeyIcon size={16} aria-hidden="true" />
      <span className="max-sm:hidden">{t("tab")}</span>
    </>
  );
}

/** Loads the user's API keys itself: the account page knows nothing of them. */
async function ApiKeyTab() {
  const { apiKeys } = await auth.api.listApiKeys({ headers: await headers() });
  return <ApiKeyManagement apiKeys={apiKeys} />;
}

export const apiKey = {
  id: "auth.apiKey",
  value: "api_keys",
  Trigger: ApiKeyTrigger,
  Component: ApiKeyTab,
} as const;
