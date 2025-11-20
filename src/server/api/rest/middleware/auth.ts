import { and, eq, gt } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import type { DBClient } from "@/server/db";
import { session as sessionTable, user } from "@/server/db/schema/auth-schema";
import { auth } from "@/shared/helpers/better-auth/auth";
import type { PermissionRequest } from "@/shared/helpers/better-auth/permissions";
import type { Context } from "../init";

/**
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
    c.set("session", session);
    return next();
  }

  // 2. Handle authentication with Bearer token
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    throw new HTTPException(401, { message: "Authorization header required" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    throw new HTTPException(401, { message: "Invalid authorization scheme" });
  }

  if (!token) {
    throw new HTTPException(401, { message: "Token required" });
  }

  const db = c.get("db") as DBClient;

  // TODO: cache this somewhere
  const [session] = await db
    .select()
    .from(sessionTable)
    .leftJoin(user, eq(user.id, sessionTable.userId))
    .where(
      and(
        eq(sessionTable.token, token),
        gt(sessionTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session || !session.user) {
    throw new HTTPException(401, {
      message: "Invalid or expired access token",
    });
  }

  // Set session on context
  c.set("session", { ...session, user: session.user! });
  return next();
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
export const withRequiredPermissions = <TPermissions extends PermissionRequest>(
  requiredPermissions: TPermissions,
): MiddlewareHandler => {
  return async (c, next) => {
    const session = c.get("session") as typeof auth.$Infer.Session;

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
