"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

import type { FormState } from "~/lib/validators";
import { CreatePostSchema, deletePostSchema } from "~/lib/validators";
import { auth } from "~/server/auth";
import { db, schema } from "~/server/db";

export async function readPostList() {
  return db.query.post.findMany({
    orderBy: desc(schema.post.id),
    limit: 10,
  });
}

export async function createPostAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();

  // Authenticate request
  if (!session?.user.id) {
    return {
      message: "You must be logged in to create a post",
    };
  }

  const data = Object.fromEntries(formData);
  const parsed = CreatePostSchema.safeParse(data);

  // Return early if the form data is invalid
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(data)) {
      fields[key] = data[key]?.toString() ?? "";
    }

    return {
      message: "Invalid form data",
      fields,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // Mutate data
    await db.insert(schema.post).values(parsed.data);

    // Invalidate cache
    revalidatePath("/");

    // Return success message
    return { message: "Post created" };
  } catch (e) {
    // Return error message
    return {
      message: "Failed to create post",
    };
  }
}

export async function deletePost(postId: number) {
  const session = await auth();

  // Authenticate request
  if (!session?.access_token) throw new Error("UNAUTHORIZED");

  const validatedFields = deletePostSchema.safeParse({
    id: postId,
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // Mutate data
  await db
    .delete(schema.post)
    .where(eq(schema.post.id, validatedFields.data.id));

  // Invalidate cache
  revalidatePath("/");
}
