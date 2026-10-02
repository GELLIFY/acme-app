import { seed } from "drizzle-seed";
import type { DBType } from "@/server/db";
import { todoTable } from "./tables";

/** A few todos for the seeded user. */
async function seedTodos(db: DBType, user: { id: string }) {
  await seed(db, { todo_table: todoTable }).refine((f) => ({
    todo_table: {
      columns: {
        text: f.loremIpsum(),
        userId: f.default({ defaultValue: user.id }),
      },
      count: 5,
    },
  }));
}

export const todo = {
  id: "example",
  seed: seedTodos,
} as const;
