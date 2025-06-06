"server-only";

import { desc } from "drizzle-orm";

import { db } from "@/server/db";
import { todo_table } from "@/server/db/schema/todos";

export async function getTodosQuery() {
  return await db
    .select()
    .from(todo_table)
    .orderBy(desc(todo_table.id))
    .limit(10);

  // Or use the simplified query sintax
  //
  // return await db.query.post.findMany({
  //   orderBy: desc(post_table.id),
  //   limit: 10,
  // });
}
