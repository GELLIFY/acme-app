import { createMiddleware } from "hono/factory";
import { db } from "@/server/db";
import type { Context } from "../init";

/**
 * Middleware that attaches the database instance to the request context.
 *
 * This middleware sets the `db` property on the context, making the database
 * available to all downstream middleware and route handlers. It should be
 * applied before any middleware or routes that require database access.
 *
 * @param c - The Hono context object representing the request.
 * @param next - The next middleware function in the chain.
 */
export const withDatabase = createMiddleware<Context>(async (c, next) => {
  // Set database on context
  c.set("db", db);

  await next();
});
