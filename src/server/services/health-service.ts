import { sql } from "drizzle-orm";

import type { DBClient } from "../db";

export async function checkHealth(db: DBClient) {
  return await db.execute(sql`SELECT 1`);
}
