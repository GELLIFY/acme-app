import "dotenv/config";

import { reset, seed } from "drizzle-seed";

import { db, schema } from ".";
import { posts } from "./schema/posts";

async function main() {
  await reset(db, schema);
  await seed(db, { posts }).refine((f) => ({
    posts: {
      columns: {
        title: f.loremIpsum(),
        content: f.loremIpsum(),
      },
      count: 5,
    },
  }));

  await db.$client.end();
}

await main();
