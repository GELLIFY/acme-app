import { apiKey as apiKeyPlugin } from "@better-auth/api-key";
import type { Statements } from "better-auth/plugins/access";
import { permissionModules } from "@/modules/permissions";
import { grantsOf } from "@/modules/registry";

export const apiKey = {
  id: "auth.apiKey",
  plugins: [
    apiKeyPlugin({
      permissions: {
        defaultPermissions: async (_referenceId) => {
          // Fetch user role or other data to determine permissions; the
          // other modules grant a new key what their `permissions.ts` says
          const permissions: Statements = grantsOf(permissionModules, "apiKey");

          return {
            ...permissions,
          };
        },
      },
    }),
  ],
} as const;
