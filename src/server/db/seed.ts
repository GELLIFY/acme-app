import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import { schema } from ".";
import { postsMock } from "./data/posts-mock";

const queryClient = postgres(env.DATABASE_URL_EXTERNAL);
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
