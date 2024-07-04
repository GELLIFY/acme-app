"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { CreatePostSchema, deletePostSchema } from "~/lib/validators";
import { auth } from "~/server/auth";
import { db, schema } from "~/server/db";

export async function readPostList() {
  return db.query.post.findMany({
    orderBy: desc(schema.post.id),
    limit: 10,
  });
}

export async function createPost(formData: FormData) {
  const session = await auth();

  // Authenticate request
  if (!session?.access_token) throw new Error("UNAUTHORIZED");

  const validatedFields = CreatePostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Mutate data
    await db.insert(schema.post).values(validatedFields.data);
  } catch (e) {
    throw new Error("Failed to create post");
  }

  // Invalidate cache
  revalidatePath("/");
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
