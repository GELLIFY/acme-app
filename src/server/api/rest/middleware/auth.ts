import { getSessionCookie } from "better-auth/cookies";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/libs/better-auth/auth";
import { permissionsOf } from "@/libs/better-auth/permissions";
import { credentialsOf } from "@/modules/registry";
import { restAuthModules } from "@/modules/rest-auth";
import type { Context } from "../init";

/**
 * Authenticates the request using either a session cookie or a credential of
 * the optional modules (`src/modules/rest-auth.ts`, e.g. an API key).
 *
 * - If a valid session cookie is present, retrieves and validates the session.
 * - If not, tries the modules' credentials in order; the first one the request carries decides.
 * - On successful authentication, attaches the session to the request context as "session".
 * - Throws HTTP 401 Unauthorized if authentication fails or required tokens are missing.
 *
 * @param c - The Hono context object.
 * @param next - The next middleware function.
 * @returns The next middleware invocation if authentication succeeds; otherwise, throws an HTTPException.
 */
export const withAuth = createMiddleware<Context>(async (c, next) => {
  // 1. Handle authentication with session cookie
  const sessionToken = getSessionCookie(c.req.raw);

  if (sessionToken) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(401, {
        message: "Invalid or expired session token",
      });
    }

    // Set session on context
    c.set("userId", session.user.id);
    c.set("permissions", permissionsOf(session.user));
    return await next();
  }

  // 2. Handle authentication with the credentials of the optional modules
  for (const credential of credentialsOf(restAuthModules)) {
    const result = await credential.authenticate(c.req.raw.headers);
    if (result === null) continue;
    if (typeof result === "string") {
      throw new HTTPException(401, { message: result });
    }

    // Set session on context
    c.set("userId", result.userId);
    c.set("permissions", result.permissions);
    return await next();
  }

  // 3. No authentication provided
  throw new HTTPException(401, { message: "Invalid authorization" });
});
