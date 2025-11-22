import { role } from "better-auth/plugins/access";
import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/shared/helpers/better-auth/auth";
import {
  expandRoles,
  type Permissions,
  type Role,
} from "@/shared/helpers/better-auth/permissions";
import type { Context } from "../init";

/**
 * Authenticates the request using either a session cookie or a Bearer token.
 *
 * - If a valid session cookie is present, retrieves and validates the session.
 * - If not, attempts to authenticate using a Bearer token in the Authorization header.
 * - On successful authentication, attaches the session to the request context as "session".
 * - Throws HTTP 401 Unauthorized if authentication fails or required tokens are missing.
 *
 * @param c - The Hono context object.
 * @param next - The next middleware function.
 * @returns The next middleware invocation if authentication succeeds; otherwise, throws an HTTPException.
 */
export const withAuth: MiddlewareHandler<Context> = async (c, next) => {
  // 1. Handle authentication with session cookie
  const sessionToken = getCookie(c, "better-auth.session_token");

  if (sessionToken) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(401, {
        message: "Invalid or expired session token",
      });
    }

    // Set session on context
    c.set("userId", session.user.id);
    c.set("permissions", expandRoles(session.user.role as Role));
    return next();
  }

  // 2. Handle authentication with api-key
  const apiKey = c.req.header("x-api-key");

  if (apiKey) {
    const data = await auth.api.verifyApiKey({
      body: {
        key: apiKey,
      },
    });

    if (!data.valid || data.error || !data.key) {
      throw new HTTPException(401, {
        message: data.error?.message ?? "Invalid or expired api-key",
      });
    }

    // Set session on context
    c.set("userId", data.key.userId);
    c.set("permissions", data.key.permissions ?? {});
    return next();
  }

  // 3. No authentication provided
  throw new HTTPException(401, { message: "Invalid authorization" });
};

/**
 * Middleware for enforcing required permissions on a request.
 * Checks that the authenticated user has all specified permissions;
 * responds with 403 if not.
 *
 * @template TPermissions - The permissions type.
 * @param {TPermissions} requiredPermissions - List or object describing required permissions.
 * @returns {MiddlewareHandler} Middleware that validates user permissions.
 */
export const withRequiredPermissions = <TPermissions extends Permissions>(
  requiredPermissions: TPermissions,
): MiddlewareHandler<Context> => {
  return async (c, next) => {
    const permissions = c.get("permissions");

    const result = role(permissions).authorize(requiredPermissions);

    if (!result.success) {
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
