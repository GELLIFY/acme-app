"use client";

import { useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { deletePostAction } from "~/server/actions/delete-post-action";
import { type schema } from "~/server/db";

export function DeletePosts(props: { post: typeof schema.post.$inferSelect }) {
  const { execute, result } = useAction(deletePostAction);

  useEffect(() => {
    if (result.data?.message) toast.success(result.data?.message);
    if (result.serverError) toast.error(result.serverError);
  }, [result]);

  return (
    <Button
      variant="ghost"
      className="cursor-pointer text-sm font-bold uppercase text-primary"
      onClick={() => execute({ id: props.post.id })}
    >
      Delete
    </Button>
  );
}
