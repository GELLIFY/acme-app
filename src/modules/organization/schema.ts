import {
  invitation,
  invitationRelations,
  member,
  memberRelations,
  organizationRelations,
  organization as organizationTable,
  userOrganizationRelations,
} from "./tables";

export const organization = {
  id: "auth.organization",
  tables: {
    organization: organizationTable,
    member,
    invitation,
    organizationRelations,
    memberRelations,
    invitationRelations,
    userOrganizationRelations,
  },
} as const;
