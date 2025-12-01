import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { env } from "@/env";
import { auth } from "@/shared/helpers/better-auth/auth";
import {
  expandRoles,
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
export const withAuth = createMiddleware<Context>(async (c, next) => {
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
    return await next();
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
    return await next();
  }

  // 3. If we are in test mode, use the userId and permissions from the context
  // Refactor with mock.module when this get fixed
  // @ref https://github.com/oven-sh/bun/issues/7823
  if (env.NODE_ENV === "test" && c.env?.userId && c.env?.permissions) {
    c.set("userId", c.env.userId);
    c.set("permissions", c.env.permissions);
    return await next();
  }

  // 4. No authentication provided
  throw new HTTPException(401, { message: "Invalid authorization" });
});
