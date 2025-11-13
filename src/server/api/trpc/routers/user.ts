import {
  changeEmail,
  changePassword,
  deleteUser,
  listSessions,
  updateUserInformation,
} from "@/server/services/user-service";
import {
  changeEmailSchema,
  changePasswordSchema,
  updateUserSchema,
} from "@/shared/validators/user.schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    return session.user;
  }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await updateUserInformation(headers, input);
    }),

  changeEmail: protectedProcedure
    .input(changeEmailSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await changeEmail(headers, input);
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await changePassword(headers, input);
    }),

  delete: protectedProcedure.mutation(async ({ ctx: { headers } }) => {
    return await deleteUser(headers);
  }),

  // Session management
  listSession: protectedProcedure.query(
    async ({ ctx: { headers, session } }) => {
      return await listSessions(headers, session.session.id);
    },
  ),
});
