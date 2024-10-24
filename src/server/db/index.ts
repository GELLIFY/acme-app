import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as post from "./schema/post";

export const schema = { ...post };

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, {
  schema: schema,
  logger: true,
});
