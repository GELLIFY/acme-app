import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { connectionStr } from "drizzle.config";

import { env } from "~/env";
import * as auth from "./schema/auth";
import * as post from "./schema/post";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ?? new Pool({ connectionString: connectionStr.toString() });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const schema = { ...auth, ...post };

export const db = drizzle(conn, { schema: schema, logger: true });
