import { drizzle } from "drizzle-orm/node-postgres";
import { connectionStr } from "drizzle.config";

import * as post from "./schema/post";

export const schema = { ...post };

export const db = drizzle(connectionStr.toString(), {
  schema: schema,
  logger: true,
});
