import { passkeyClient } from "@better-auth/passkey/client";

export const passkey = {
  id: "auth.passkey",
  plugins: [passkeyClient()],
} as const;
