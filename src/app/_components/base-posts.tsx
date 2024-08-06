import { Suspense } from "react";

import { CreatePostForm } from "~/components/forms/create-post-form";
import { Loading } from "./base-posts.loading";
import { BasePostsServer } from "./base-posts.server";

export function BasePosts() {
  return (
    <>
      <CreatePostForm />
      <div className="w-full max-w-2xl overflow-y-scroll">
        <Suspense fallback={<Loading />}>
          <BasePostsServer />
        </Suspense>
      </div>
    </>
  );
}
