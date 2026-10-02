import { organizationRouter } from "./server/trpc-router";

export const organization = {
  id: "auth.organization",
  routers: { organization: organizationRouter },
} as const;
