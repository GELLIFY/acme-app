import { twoFactor as twoFactorPlugin } from "better-auth/plugins/two-factor";

export const twoFactor = {
  id: "auth.twoFactor",
  plugins: [twoFactorPlugin({ issuer: "Acme App" })],
} as const;
