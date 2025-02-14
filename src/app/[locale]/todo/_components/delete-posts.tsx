"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { deletePostAction } from "~/server/actions/delete-post-action";
import { type SelectPost } from "~/server/db/schema/posts";

export function DeletePosts(props: { post: SelectPost }) {
  const { execute, result } = useAction(deletePostAction);

  useEffect(() => {
    if (result.data?.message) toast.success(result.data?.message);
    if (result.serverError) toast.error(result.serverError);
  }, [result]);

  return (
    <Button
      variant="ghost"
      className="text-primary cursor-pointer text-sm font-bold uppercase"
      onClick={() => execute({ id: props.post.id })}
    >
      Delete
    </Button>
  );
}
