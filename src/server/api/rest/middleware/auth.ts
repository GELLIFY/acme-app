import { auth } from "@clerk/nextjs/server";
import type { MiddlewareHandler } from "hono";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth();

  if (!session?.userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Set database on context
  c.set("session", session);

  await next();
};
