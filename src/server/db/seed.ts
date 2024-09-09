import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { connectionStr } from "drizzle.config";
import postgres from "postgres";

import { schema } from ".";
import { postsMock } from "./data/posts-mock";

const queryClient = postgres(connectionStr.toString());
const db = drizzle(queryClient);

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

// closing connection
await queryClient.end();
