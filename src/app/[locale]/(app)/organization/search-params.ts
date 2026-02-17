import { createLoader, parseAsString } from "nuqs/server";

const organizationSearchParams = {
  invite: parseAsString,
};

export const loadOrganizationSearchParams = createLoader(
  organizationSearchParams,
);
