import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  apiKeyClient,
  inferAdditionalFields,
  lastLoginMethodClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { ac, adminRole, userRole } from "./permissions";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000"
  plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    apiKeyClient(),
    lastLoginMethodClient(),
    passkeyClient(),
    twoFactorClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
