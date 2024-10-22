import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { connectionStr } from "drizzle.config";

import { schema } from ".";
import { postsMock } from "./data/posts-mock";

const db = drizzle(connectionStr.toString());

console.log("Seed start");
await db
  .insert(schema.post)
  .values(postsMock)
  .onConflictDoUpdate({
    target: schema.post.id,
    set: {
      title: sql`excluded.name`,
      content: sql`excluded.content`,
    },
  });
console.log("Seed done");
