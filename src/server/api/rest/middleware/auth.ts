import type { MiddlewareHandler } from "hono";
import { auth } from "@clerk/nextjs/server";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth();
  console.log(session);

  if (!session?.userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Set database on context
  c.set("session", session);

  await next();
};
