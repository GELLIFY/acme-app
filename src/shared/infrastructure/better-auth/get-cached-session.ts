import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const getCachedSession = cache(async () => {
  const headersList = await headers();
  return auth.api.getSession({ headers: headersList });
});
