import { eq } from "drizzle-orm";
import { type z } from "zod";

import { type CreatePostSchema, type DeletePostSchema } from "@/lib/validators";
import { db, schema } from "..";

export async function deletePostMutation(
  params: z.infer<typeof DeletePostSchema>,
) {
  await db.delete(schema.posts).where(eq(schema.posts.id, params.id));
}

export async function createPostMutation(
  params: z.infer<typeof CreatePostSchema>,
) {
  await db.insert(schema.posts).values(params);
}
