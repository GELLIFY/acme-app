import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/shared/helpers/better-auth/auth";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    throw new HTTPException(401, { message: "Authorization header required" });
  }

  // Set sessioj on context
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};
