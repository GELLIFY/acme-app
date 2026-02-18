import type z from "zod";
import { auth } from "@/libs/better-auth/auth";
import type { updateOrganizationSchema } from "@/shared/validators/organization.schema";

// Update user
export async function updateOrganizationInformation(
  headers: Headers,
  params: z.infer<typeof updateOrganizationSchema>,
) {
  const data = await auth.api.updateOrganization({
    headers,
    body: {
      data: {
        ...params,
      },
    },
  });

  return data;
}
