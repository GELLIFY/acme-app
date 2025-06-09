import { TRPCError } from "@trpc/server";

import { type createTRPCContext } from "../init";

type TRPCContextType = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Middleware for authenticated procedure execution.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
export const authMiddleware = async <TReturn>(opts: {
  ctx: TRPCContextType;
  next: (opts: { ctx: Partial<TRPCContextType> }) => Promise<TReturn>;
}) => {
  const { session } = opts.ctx;

  if (!session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      session,
    },
  });
};
