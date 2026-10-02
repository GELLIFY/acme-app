import { apiKey as apiKeyPlugin } from "@better-auth/api-key";
import type { Statements } from "better-auth/plugins/access";

export const apiKey = {
  id: "auth.apiKey",
  plugins: [
    apiKeyPlugin({
      permissions: {
        defaultPermissions: async (_referenceId) => {
          // Fetch user role or other data to determine permissions
          const permissions: Statements = {
            todo: ["create"],
          };

          return {
            ...permissions,
          };
        },
      },
    }),
  ],
} as const;
