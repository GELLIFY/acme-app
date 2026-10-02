import { organizationClient } from "better-auth/client/plugins";

export const organization = {
  id: "auth.organization",
  plugins: [organizationClient()],
} as const;
