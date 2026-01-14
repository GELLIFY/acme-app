import { randomUUID } from "node:crypto";
import { initTRPC } from "@trpc/server";
import { createWideEvent, shouldSample } from "@/shared/helpers/wide-event";
import { logger } from "@/shared/infrastructure/logger/pino-logger";
import type { createTRPCContext } from "../init";

export function wideEventPlugin() {
  // When creating a plugin for tRPC, you use the same API as creating any other tRPC-app
  // this is the plugin's root `t`-object
  const t = initTRPC.context<typeof createTRPCContext>().create();

  return {
    // you can also add `.input()` if you want your plugin to do input validation
    pluginProc: t.procedure.use(async (opts) => {
      const startTime = Date.now();

      // Initialize the wide event with request context
      const requestId = opts.ctx.headers.get("x-request-id") ?? randomUUID();
      const event = createWideEvent(requestId);
      event.method = opts.type;
      event.path = opts.path;

      try {
        const result = await opts.next({
          // Make the event accessible to handlers
          ctx: { wideEvent: event },
        });

        if (!result.ok) {
          event.error = {
            message: result.error.message,
            stack: result.error.stack,
            code: result.error.code,
            cause: result.error.cause,
            name: result.error.name,
          };
        }

        return result;
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
        if (shouldSample(event)) logger.info("wide_event", event);
      }
    }),
  };
}
