import { auth } from "@/libs/better-auth/auth";
import { updateOrganizationInformation } from "@/server/domains/auth/organization-service";
import { updateOrganizationSchema } from "@/shared/validators/organization.schema";
import { createTRPCRouter, protectedProcedure } from "../init";

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

  update: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ ctx: { headers }, input }) => {
      return await updateOrganizationInformation(headers, input);
    }),
});
