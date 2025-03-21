import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { posts } from "@/server/db/schema/posts";

export const CreatePostSchema = createInsertSchema(posts);

export const DeletePostSchema = z.object({
  id: z.string(),
});
