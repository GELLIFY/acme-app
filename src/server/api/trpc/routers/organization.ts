import { auth } from "@/libs/better-auth/auth";
import { createTRPCRouter, protectedProcedure } from "../init";

export const organizationRouter = createTRPCRouter({
  active: protectedProcedure.query(async ({ ctx: { session, headers } }) => {
    const data = await auth.api.listOrganizations({
      headers,
    });

    return data.find((org) => org.id === session.session.activeOrganizationId);
  }),
});
