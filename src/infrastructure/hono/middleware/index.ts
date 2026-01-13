import type { MiddlewareHandler } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import type { Context } from "../init";
import { withAuth } from "./auth";
import { withDatabase } from "./db";
import { withWideEvent } from "./with-wide-event";

/**
 * Public endpoint middleware - only attaches database with smart routing
 * No authentication required
 */
export const publicMiddleware: MiddlewareHandler<Context>[] = [
  withWideEvent,
  withDatabase,
];

/**
 * Protected endpoint middleware - requires authentication
 * Includes database with smart routing and authentication
 * Note: withAuth must be first to set session in context
 */
export const protectedMiddleware: MiddlewareHandler<Context>[] = [
  withWideEvent,
  withDatabase,
  withAuth,
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100,
    keyGenerator: (c) => {
      return c.get("userId");
    },
    statusCode: 429,
    message: "Rate limit exceeded",
  }),
];
