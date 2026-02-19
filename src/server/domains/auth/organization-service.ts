import type z from "zod";
import { auth } from "@/libs/better-auth/auth";
import type {
  listInvitationsSchema,
  listMembersSchema,
  listUserInvitationsSchema,
  updateOrganizationSchema,
} from "@/shared/validators/organization.schema";

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

export async function listMembers(
  headers: Headers,
  params: z.infer<typeof listMembersSchema>,
) {
  const data = await auth.api.listMembers({
    headers,
    query: {
      ...params,
    },
  });

  return data;
}

export async function listInvitations(
  headers: Headers,
  params: z.infer<typeof listInvitationsSchema>,
) {
  const data = await auth.api.listInvitations({
    headers,
    query: {
      ...params,
    },
  });

  return data;
}

export async function listUserInvitations(
  headers: Headers,
  params: z.infer<typeof listUserInvitationsSchema>,
) {
  const data = await auth.api.listUserInvitations({
    headers,
    query: {
      ...params,
    },
  });

  return data;
}
