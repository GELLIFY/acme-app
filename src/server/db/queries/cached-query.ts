import { unstable_cache } from "next/cache";

import { getPostsQuery } from ".";

export async function getPosts() {
  return unstable_cache(
    async () => {
      return await getPostsQuery();
    },
    ["posts"],
    {
      tags: ["posts"],
      revalidate: 3600,
    },
  )();
}
