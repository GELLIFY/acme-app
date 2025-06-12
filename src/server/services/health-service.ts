import { sql } from "drizzle-orm";

import { db } from "../db";

export async function checkHealth() {
  await db.execute(sql`SELECT 1`);
}
