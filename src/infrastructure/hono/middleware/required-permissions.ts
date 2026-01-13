import { role } from "better-auth/plugins/access";
import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import {
  formatPermissions,
  type Permissions,
} from "@/infrastructure/better-auth/permissions";
import type { Context } from "../init";

/**
 * Middleware for enforcing required permissions on a request.
 * Checks that the authenticated user has all specified permissions;
 * responds with 403 if not.
 *
 * @template TPermissions - The permissions type.
 * @param {TPermissions} requiredPermissions - List or object describing required permissions.
 * @returns {MiddlewareHandler<Context>} Middleware that validates user permissions.
 */
export const withRequiredPermissions = <TPermissions extends Permissions>(
  requiredPermissions: TPermissions,
): MiddlewareHandler<Context> => {
  return createMiddleware(async (c, next) => {
    const permissions = c.get("permissions");

    if (!permissions) {
      return c.json(
        {
          error: "Unauthorized",
          description:
            "No permissions found for the current user. Authentication is required.",
        },
        401,
      );
    }

    const result = role(permissions).authorize(requiredPermissions);

    if (!result.success) {
      return c.json(
        {
          error: "Forbidden",
          description: `Insufficient permissions. Required permissions: [${formatPermissions(requiredPermissions)}]. Your permissions: [${formatPermissions(permissions)}]`,
        },
        403,
      );
    }

    await next();
  });
};
