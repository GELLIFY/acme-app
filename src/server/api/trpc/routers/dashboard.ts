import { createTRPCRouter, protectedProcedure } from "@/infrastructure/trpc";

export const dashboardRouter = createTRPCRouter({
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      userId: ctx.session.user.id,
    };
  }),
});
