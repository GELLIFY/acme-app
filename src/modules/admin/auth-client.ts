import { adminClient } from "better-auth/client/plugins";
import { ac, adminRole, userRole } from "@/libs/better-auth/permissions";

export const admin = {
  id: "auth.admin",
  plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
  ],
} as const;
