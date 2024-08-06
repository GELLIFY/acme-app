"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { authActionClient } from "~/lib/safe-action";
import { deletePostSchema } from "~/lib/validators";
import { db, schema } from "~/server/db";

export const deletePostAction = authActionClient
  .schema(deletePostSchema)
  .action(async ({ parsedInput }) => {
    // Mutate data
    await db.delete(schema.post).where(eq(schema.post.id, parsedInput.id));

    // Invalidate cache
    revalidatePath("/");

    return { message: "Post deleted" };
  });
