import { createMiddleware } from "hono/factory";
import { logger, type WideEvent } from "@/lib/logger";
import type { Context } from "../init";

export const withEvent = createMiddleware<Context>(async (ctx, next) => {
  const startTime = Date.now();

  // Initialize the wide event with request context
  const event: Partial<WideEvent> = {
    request_id: ctx.get("requestId"),
    timestamp: new Date().toISOString(),
    method: ctx.req.method,
    path: ctx.req.path,
    // Example fields
    // service: process.env.SERVICE_NAME,
    // version: process.env.SERVICE_VERSION,
    // deployment_id: process.env.DEPLOYMENT_ID,
    // region: process.env.REGION,
  };

  // Make the event accessible to handlers
  ctx.set("wideEvent", event);

  try {
    await next();
    event.status_code = ctx.res.status;
    event.outcome = "success";
  } catch (e) {
    const error = e as Error;
    event.status_code = 500;
    event.outcome = "error";
    event.error = {
      type: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    };
    throw e;
  } finally {
    event.duration_ms = Date.now() - startTime;

    // Emit the wide event
    logger.info(event);
  }
});
