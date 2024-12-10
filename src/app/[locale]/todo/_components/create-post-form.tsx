"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createPostSchema } from "~/lib/validators";
import { createPostAction } from "~/server/actions/create-post-action";

export function CreatePostForm() {
  const { execute, isExecuting } = useAction(createPostAction, {
    onError: ({ error }) => {
      toast.error(error.serverError, {
        duration: 3500,
      });
    },
    onSuccess: () => {
      toast.success("Post creato!", {
        duration: 3500,
      });
    },
  });

  const form = useForm<z.output<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={form.handleSubmit(execute)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid || isExecuting}>
          Create
        </Button>
      </form>
    </Form>
  );
}
