import { deleteUser, updateUser } from "@/server/services/user-service";
import { updateUserSchema } from "@/shared/validators/user.schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    return session.user;
  }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await updateUser(headers, input);
    }),

  delete: protectedProcedure.mutation(async ({ ctx: { headers } }) => {
    return await deleteUser(headers);
  }),
});
