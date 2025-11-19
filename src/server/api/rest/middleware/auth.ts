import { and, eq, gt } from "drizzle-orm";
import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import type { DBClient } from "@/server/db";
import { session as sessionTable, user } from "@/server/db/schema/auth-schema";
import { auth } from "@/shared/helpers/better-auth/auth";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withAuth: MiddlewareHandler = async (c, next) => {
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

  if (!session) {
    throw new HTTPException(401, {
      message: "Invalid or expired access token",
    });
  }

  // Set session on context
  c.set("session", session);
  return next();
};
