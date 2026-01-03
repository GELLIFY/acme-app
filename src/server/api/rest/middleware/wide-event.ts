import { randomUUID } from "node:crypto";
import { createMiddleware } from "hono/factory";
import { logger } from "@/shared/infrastructure/logger";
import type { Context } from "../init";

export const withWideEvent = createMiddleware<Context>(async (ctx, next) => {
  const startTime = Date.now();

  // Initialize the wide event with request context
  const event: Record<string, unknown> = {
    request_id: ctx.req.header("x-request-id") || randomUUID(),
    timestamp: new Date().toISOString(),
    method: ctx.req.method,
    path: ctx.req.path,
    // ... add event fields here
  };

  // Make the event accessible to handlers
  ctx.set("wideEvent", event);

  try {
    await next();
    event.status_code = ctx.res.status;
  } catch (error) {
    event.status_code = 500;
    event.error = error;
    throw error;
  } finally {
    event.duration_ms = Date.now() - startTime;

    // Emit the wide event
    logger.info(event);
  }
});
