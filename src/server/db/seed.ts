import "dotenv/config";

import { reset, seed } from "drizzle-seed";

import { db } from ".";
import { schema } from "./schema";
import { todoTable } from "./schema/todos";

async function main() {
  await reset(db, schema);
  await seed(db, { todo_table: todoTable }).refine((f) => ({
    todo_table: {
      columns: {
        text: f.loremIpsum(),
      },
      count: 5,
    },
  }));

  await db.$client.end();
}

await main();
