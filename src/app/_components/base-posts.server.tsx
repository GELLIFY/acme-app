import { desc } from "drizzle-orm";

import { db, schema } from "~/server/db";
import { DeletePosts } from "./delete-posts";

export async function BasePostsServer() {
  const posts = await db.query.post.findMany({
    orderBy: desc(schema.post.id),
    limit: 10,
  });

  if (posts.length === 0) {
    return (
      <div className="flex h-[100px] w-full items-center justify-center rounded border border-dashed">
        <p className="text-xl font-bold text-slate-500">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col space-y-4 divide-y rounded border p-4">
      {posts.map((post) => {
        return (
          <div className="flex flex-row rounded-lg" key={post.id}>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-primary">{post.title}</h2>
              <p className="mt-2 text-sm">{post.content}</p>
            </div>
            <DeletePosts post={post} />
          </div>
        );
      })}
    </div>
  );
}
