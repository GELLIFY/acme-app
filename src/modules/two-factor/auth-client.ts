import { twoFactorClient } from "better-auth/client/plugins";

export const twoFactor = {
  id: "auth.twoFactor",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/2fa";
      },
    }),
  ],
} as const;
