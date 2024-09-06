"use server";

import { revalidateTag } from "next/cache";

import { authActionClient } from "~/lib/safe-action";
import { createPostSchema } from "~/lib/validators";
import { createPostMutation } from "~/server/db/mutations";

export const createPostAction = authActionClient
  .schema(createPostSchema)
  .metadata({ actionName: "create-post" })
  .action(async ({ parsedInput }) => {
    // Mutate data
    await createPostMutation(parsedInput);

    // Invalidate cache
    revalidateTag("posts");

    // Return success message
    return { message: "Post created" };
  });
