import { sql } from "drizzle-orm";

import { db, schema } from ".";
import { postsMock } from "./data/posts-mock";

async function main() {
  console.log("Seed start");
  await db
    .insert(schema.post)
    .values(postsMock)
    .onConflictDoUpdate({
      target: schema.post.id,
      set: {
        title: sql`excluded.title`,
        content: sql`excluded.content`,
      },
    });

  // @ts-expect-error wrong typings
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await db.$client.end();
  console.log("Seed done");
}

await main();
