import { passkey as passkeyPlugin } from "@better-auth/passkey";

export const passkey = {
  id: "auth.passkey",
  plugins: [passkeyPlugin()],
} as const;
