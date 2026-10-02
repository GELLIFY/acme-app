import {
  inferAdditionalFields,
  lastLoginMethodClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authClientModules } from "@/modules/auth-client";
import { pluginsOf } from "@/modules/registry";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000"
  plugins: [
    lastLoginMethodClient(),
    ...pluginsOf(authClientModules),
    inferAdditionalFields<typeof auth>(),
  ],
  fetchOptions: {
    headers: {
      "x-request-id": crypto.randomUUID(),
    },
  },
});
