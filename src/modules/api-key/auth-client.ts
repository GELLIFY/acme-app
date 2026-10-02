import { apiKeyClient } from "@better-auth/api-key/client";

export const apiKey = {
  id: "auth.apiKey",
  plugins: [apiKeyClient()],
} as const;
