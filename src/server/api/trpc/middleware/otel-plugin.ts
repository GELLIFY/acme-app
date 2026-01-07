import { type Span, trace } from "@opentelemetry/api";
import { initTRPC } from "@trpc/server";
import { flatten } from "flat";
import type { createTRPCContext } from "../init";

type OtelOptions = {
  collectInput?: boolean;
  collectResult?: boolean;
  instrumentedContextFields?: string[];
  headers?: string[];
};

export function otelPlugin(options: OtelOptions = {}) {
  // When creating a plugin for tRPC, you use the same API as creating any other tRPC-app
  // this is the plugin's root `t`-object
  const t = initTRPC.context<typeof createTRPCContext>().create();

  return {
    // you can also add `.input()` if you want your plugin to do input validation
    pluginProc: t.procedure.use(async (opts) => {
      const tracer = trace.getTracer("trpc");
      return tracer.startActiveSpan(`TRPC ${opts.type}`, async (span: Span) => {
        const result = await opts.next();

        // opts.rawInput is for v10, `opts.getRawInput` is for v11
        const rawInput = await opts.getRawInput();
        if (options.collectInput && typeof rawInput === "object") {
          span.setAttributes(flatten({ input: rawInput }));
        }
        const meta = { path: opts.path, type: opts.type, ok: result.ok };
        span.setAttributes(meta);
        span.end();
        return result;
      });
    }),
  };
}
