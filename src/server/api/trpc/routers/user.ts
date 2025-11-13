import {
  disableTwoFactor,
  enableTwoFactor,
  verifyTopt,
} from "@/server/domains/auth/two-factor-service";
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
  twoFactorSchema,
  updateUserSchema,
  verifyToptSchema,
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

  // Two-Factor
  enableTwoFactor: protectedProcedure
    .input(twoFactorSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await enableTwoFactor(headers, input);
    }),

  disableTwoFactor: protectedProcedure
    .input(twoFactorSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await disableTwoFactor(headers, input);
    }),

  verifyTopt: protectedProcedure
    .input(verifyToptSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await verifyTopt(headers, input);
    }),
});
