import { randomUUID } from "node:crypto";
import { initTRPC } from "@trpc/server";
import { logger } from "@/shared/infrastructure/logger";
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
      const event: Record<string, unknown> = {
        request_id: opts.ctx.headers.get("x-request-id") || randomUUID(),
        timestamp: new Date().toISOString(),
        method: opts.type,
        path: opts.path,
        // ... add event fields here
      };

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
        event.error = error;
        throw error;
      } finally {
        event.duration_ms = Date.now() - startTime;

        // Emit the wide event
        logger.info(event);
      }
    }),
  };
}
