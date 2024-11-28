import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { posts } from "~/server/db/schema/posts";

export const createPostSchema = createInsertSchema(posts);

export const deletePostSchema = z.object({
  id: z.string(),
});
