import "dotenv/config";

import { reset, seed } from "drizzle-seed";

import { db } from ".";
import { schema } from "./schema";
import { todo_table } from "./schema/todos";

async function main() {
  await reset(db, schema);
  await seed(db, { todo_table }).refine((f) => ({
    todo_table: {
      columns: {
        text: f.loremIpsum(),
        deletedAt: f.default({ defaultValue: null }),
      },
      count: 5,
    },
  }));

  await db.$client.end();
}

await main();
