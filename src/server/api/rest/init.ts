import type { MiddlewareHandler } from "hono";
import { rateLimiter } from "hono-rate-limiter";

import type { db } from "@/server/db";
import type { auth } from "@/shared/helpers/better-auth/auth";
import { withAuth } from "./middleware/auth";
import { withDatabase } from "./middleware/db";

export type Context = {
  Variables: {
    db: typeof db;
    session: typeof auth.$Infer.Session;
  };
};

/**
 * Public endpoint middleware - only attaches database with smart routing
 * No authentication required
 */
export const publicMiddleware: MiddlewareHandler<Context>[] = [withDatabase];

/**
 * Protected endpoint middleware - requires authentication
 * Includes database with smart routing and authentication
 * Note: withAuth must be first to set session in context
 */
export const protectedMiddleware: MiddlewareHandler<Context>[] = [
  withDatabase,
  withAuth,
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100,
    keyGenerator: (c) => {
      return c.get("session").user.id;
    },
    statusCode: 429,
    message: "Rate limit exceeded",
  }),
];
