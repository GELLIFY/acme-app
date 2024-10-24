import { sql } from "drizzle-orm";

import { client, db, schema } from ".";
import { postsMock } from "./data/posts-mock";

async function main() {
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

  await client.end();
  console.log("Seed done");
}

await main();
