import { auth } from "@/libs/better-auth/auth";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc/init";
import {
  listInvitationsSchema,
  listMembersSchema,
  listUserInvitationsSchema,
} from "../validators";
import {
  listInvitations,
  listMembers,
  listUserInvitations,
} from "./organization-service";

export const organizationRouter = createTRPCRouter({
  active: protectedProcedure.query(async ({ ctx: { session, headers } }) => {
    const data = await auth.api.listOrganizations({
      headers,
    });

    return (
      data.find((org) => org.id === session.session.activeOrganizationId) ??
      null
    );
  }),

  list: protectedProcedure.query(async ({ ctx: { headers } }) => {
    return await auth.api.listOrganizations({
      headers,
    });
  }),

  listMembers: protectedProcedure
    .input(listMembersSchema)
    .query(async ({ ctx: { headers }, input }) => {
      return await listMembers(headers, input);
    }),

  listInvitations: protectedProcedure
    .input(listInvitationsSchema)
    .query(async ({ ctx: { headers }, input }) => {
      return await listInvitations(headers, input);
    }),

  listUserInvitations: protectedProcedure
    .input(listUserInvitationsSchema)
    .query(async ({ ctx: { headers }, input }) => {
      return await listUserInvitations(headers, input);
    }),
});
