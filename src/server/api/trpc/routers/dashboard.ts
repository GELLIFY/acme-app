import {
  createTRPCRouter,
  protectedProcedure,
} from "@/infrastructure/trpc/init";

export const dashboardRouter = createTRPCRouter({
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      userId: ctx.session.user.id,
    };
  }),
});
