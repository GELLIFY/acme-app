"server-only";

import { desc } from "drizzle-orm";

import { db, schema } from "..";

export async function getPostsQuery() {
  return await db.query.post.findMany({
    orderBy: desc(schema.post.id),
    limit: 10,
  });
}
