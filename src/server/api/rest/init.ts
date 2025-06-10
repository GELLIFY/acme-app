import type { MiddlewareHandler } from "hono";
import { type auth } from "@clerk/nextjs/server";

import type { db } from "@/server/db";
// import { withAuth } from "./middleware/auth";
import { withDatabase } from "./middleware/db";

export type Context = {
  Variables: {
    db: typeof db;
    session: Awaited<ReturnType<typeof auth>>;
  };
};

/**
 * Public endpoint middleware - only attaches database with smart routing
 * No authentication required
 */
export const publicMiddleware: MiddlewareHandler[] = [withDatabase];

/**
 * Protected endpoint middleware - requires authentication
 * Includes database with smart routing and authentication
 * Note: withAuth must be first to set session in context
 */
export const protectedMiddleware: MiddlewareHandler[] = [
  withDatabase,
  // withAuth,
  //   rateLimiter({
  //     windowMs: 10 * 60 * 1000, // 10 minutes
  //     limit: 100,
  //     keyGenerator: (c) => {
  //       return c.get("session")?.user?.id ?? "unknown";
  //     },
  //     statusCode: 429,
  //     message: "Rate limit exceeded",
  //   }),
];
