import { initTRPC, TRPCError } from "@trpc/server";
import type { createTRPCContext } from "../init";

export function adminPlugin() {
  // When creating a plugin for tRPC, you use the same API as creating any other tRPC-app
  // this is the plugin's root `t`-object
  const t = initTRPC.context<typeof createTRPCContext>().create();

  return {
    // you can also add `.input()` if you want your plugin to do input validation
    pluginProc: t.procedure.use(async (opts) => {
      const { session } = opts.ctx;

      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (session.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return opts.next({
        ctx: {
          ...opts.ctx,
          session,
        },
      });
    }),
  };
}
