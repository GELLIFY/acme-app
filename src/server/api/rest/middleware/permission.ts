import type { MiddlewareHandler } from "hono";
import { auth } from "@/shared/helpers/better-auth/auth";
import type { PermissionRequest } from "@/shared/helpers/better-auth/permissions";

type Session = typeof auth.$Infer.Session;

export const withRequiredPermissions = <TPermissions extends PermissionRequest>(
  requiredPermissions: TPermissions,
): MiddlewareHandler => {
  return async (c, next) => {
    const session = c.get("session") as Session;

    const data = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
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
