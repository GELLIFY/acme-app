import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "~/env";
import * as post from "./schema/post";

export const schema = { ...post };

export const db = drizzle(env.DATABASE_URL, {
  schema: schema,
  logger: true,
  casing: "snake_case",
});
