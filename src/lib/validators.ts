import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { post } from "~/server/db/schema/post";

export const createPostSchema = createInsertSchema(post);

export const deletePostSchema = z.object({
  id: z.number(),
});
