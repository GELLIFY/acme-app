import { headers } from "next/headers";
import { auth } from "@/libs/better-auth/auth";
import { PasskeyManagement } from "./components/passkey-management";

/** Loads the user's passkeys itself: the account page knows nothing of them. */
async function PasskeySection() {
  const passkeys = await auth.api.listPasskeys({ headers: await headers() });
  return <PasskeyManagement passkeys={passkeys} />;
}

export const passkey = {
  id: "auth.passkey",
  Component: PasskeySection,
} as const;
