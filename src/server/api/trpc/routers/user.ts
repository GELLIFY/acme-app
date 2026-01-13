import {
  createTRPCRouter,
  protectedProcedure,
} from "@/infrastructure/trpc/init";
import {
  changePassword,
  deleteUser,
  updateUserInformation,
} from "@/server/domains/auth/user-service";
import {
  changePasswordSchema,
  updateUserSchema,
} from "@/shared/validators/user.schema";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    return session.user;
  }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await updateUserInformation(headers, input);
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await changePassword(headers, input);
    }),

  delete: protectedProcedure.mutation(async ({ ctx: { headers } }) => {
    return await deleteUser(headers);
  }),
});
