"server-only";

import { desc } from "drizzle-orm";

import { db, schema } from "..";

export async function getPostsQuery() {
  return await db
    .select()
    .from(schema.post)
    .orderBy(desc(schema.post.id))
    .limit(10);

  // Or use the simplified query sintax
  //
  // return await db.query.post.findMany({
  //   orderBy: desc(schema.post.id),
  //   limit: 10,
  // });
}
