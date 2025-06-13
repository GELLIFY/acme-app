import { createTRPCRouter, protectedProcedure } from "../init";

export const dashboardRouter = createTRPCRouter({
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      userId: ctx.session.userId,
    };
  }),
});
