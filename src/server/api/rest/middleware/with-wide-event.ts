import { randomUUID } from "node:crypto";
import { createMiddleware } from "hono/factory";
import { serverLogger } from "@/infrastructure/logger/pino-logger";
import { createWideEvent, shouldSample } from "@/shared/helpers/wide-event";
import type { Context } from "../init";

export const withWideEvent = createMiddleware<Context>(async (ctx, next) => {
  const startTime = Date.now();

  // Initialize the wide event with request context
  const requestId = ctx.req.header("x-request-id") || randomUUID();
  const event = createWideEvent(requestId);
  event.method = ctx.req.method;
  event.path = ctx.req.path;

  // Make the event accessible to handlers
  ctx.set("wideEvent", event);

  try {
    await next();
    event.status_code = ctx.res.status;
  } catch (error) {
    const e = error as Error;
    event.status_code = 500;
    event.error = {
      message: e.message,
      stack: e.stack,
      cause: e.cause,
      name: e.name,
    };
    throw error;
  } finally {
    event.duration_ms = Date.now() - startTime;

    // Emit the wide event
    if (shouldSample(event)) serverLogger.info("wide_event", event);
  }
});
