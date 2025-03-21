"use server";

import { revalidatePath } from "next/cache";

import { authActionClient } from "@/lib/safe-action";
import { DeletePostSchema } from "@/lib/validators";
import { deletePostMutation } from "@/server/db/mutations";

export const deletePostAction = authActionClient
  .schema(DeletePostSchema)
  .metadata({ actionName: "delete-post" })
  .action(async ({ parsedInput }) => {
    // Mutate data
    await deletePostMutation(parsedInput);

    // Invalidate cache
    revalidatePath("/todo");

    // Return response
    return { message: "Post deleted" };
  });
