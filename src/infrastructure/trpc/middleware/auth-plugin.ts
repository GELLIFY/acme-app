import { initTRPC, TRPCError } from "@trpc/server";
import type { createTRPCContext } from "../init";

export function authPlugin() {
  // When creating a plugin for tRPC, you use the same API as creating any other tRPC-app
  // this is the plugin's root `t`-object
  const t = initTRPC.context<typeof createTRPCContext>().create();

  return {
    // you can also add `.input()` if you want your plugin to do input validation
    pluginProc: t.procedure.use(async (opts) => {
      const { session, wideEvent } = opts.ctx;

      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Add user context
      wideEvent.user = {
        id: session.user.id,
        role: session.user.role,
        // TODO: add more user properties here
        // subscription: user.subscription,
        // account_age_days: daysSince(user.createdAt),
        // lifetime_value_cents: user.ltv,
      };

      return opts.next({
        ctx: {
          ...opts.ctx,
          session,
        },
      });
    }),
  };
}
