import type { MiddlewareHandler } from "hono";

import { db } from "@/server/db";
import type { Context } from "../init";

/**
 * Database middleware that connects to the database and sets it on context
 */
export const withDatabase: MiddlewareHandler<Context> = async (c, next) => {
  // Set database on context
  c.set("db", db);

  await next();
};
