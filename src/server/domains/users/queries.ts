"server-only";

import { db } from "@/server/db";
import { user } from "@/server/db/schema/auth-schema";

export async function getUsers() {
  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user);
}
