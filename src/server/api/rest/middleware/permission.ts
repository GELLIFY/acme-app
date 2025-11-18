import type { Session } from "better-auth";
import type { MiddlewareHandler } from "hono";
import { auth } from "@/shared/helpers/better-auth/auth";
import type { PermissionRequest } from "@/shared/helpers/better-auth/permissions";

export const withRequiredPermissions = <TPermissions extends PermissionRequest>(
  requiredPermissions: TPermissions,
): MiddlewareHandler => {
  return async (c, next) => {
    const session = c.get("session") as Session;

    const data = await auth.api.userHasPermission({
      body: {
        userId: session.userId,
        permissions: requiredPermissions,
      },
    });

    if (!data.success) {
      return c.json(
        {
          error: "Forbidden",
          description: "Insufficient permissions",
        },
        403,
      );
    }

    await next();
  };
};
