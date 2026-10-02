import { admin as adminPlugin } from "better-auth/plugins/admin";
import { ac, adminRole, userRole } from "@/libs/better-auth/permissions";

export const admin = {
  id: "auth.admin",
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
  ],
} as const;
