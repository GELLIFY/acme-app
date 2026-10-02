import { auth } from "@/libs/better-auth/auth";
import type { RestCredential } from "../registry";

/** An API key in the `x-api-key` header, verified by Better Auth. */
export const apiKey = {
  id: "auth.apiKey",
  securitySchemes: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "x-api-key",
      description:
        "Authentication using the x-api-key header. Example: 'x-api-key: <your-api-key>'",
    },
  },
  async authenticate(headers) {
    const key = headers.get("x-api-key");
    if (!key) return null;

    const data = await auth.api.verifyApiKey({ body: { key } });
    if (!data.valid || data.error || !data.key) {
      return (data.error?.message as string) ?? "Invalid or expired api-key";
    }
    return {
      userId: data.key.referenceId,
      permissions: data.key.permissions ?? {},
    };
  },
} as const satisfies RestCredential;
