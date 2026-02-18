import { auth } from "@/libs/better-auth/auth";
import {
  listInvitations,
  listMembers,
  updateOrganizationInformation,
} from "@/server/domains/auth/organization-service";
import {
  listInvitationsSchema,
  listMembersSchema,
  updateOrganizationSchema,
} from "@/shared/validators/organization.schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const organizationRouter = createTRPCRouter({
  active: protectedProcedure.query(async ({ ctx: { session, headers } }) => {
    const data = await auth.api.listOrganizations({
      headers,
    });

    const activeOrganization = data.find(
      (org) => org.id === session.session.activeOrganizationId,
    );

    if (!activeOrganization) return null;

    return await auth.api.getFullOrganization({
      headers,
      query: {
        organizationId: activeOrganization?.id,
        organizationSlug: activeOrganization?.slug,
        membersLimit: 100,
      },
    });
  }),

  list: protectedProcedure.query(async ({ ctx: { headers } }) => {
    return await auth.api.listOrganizations({
      headers,
    });
  }),

  update: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await updateOrganizationInformation(headers, input);
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
});
