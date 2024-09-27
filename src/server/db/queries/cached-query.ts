import { unstable_cache } from "next/cache";

import { getPostsQuery } from ".";

export async function getPosts() {
  return unstable_cache(
    async () => {
      return await getPostsQuery();

      // NOTE: do whatever you want here, map, aggregate filter...
      // result will be cached and typesafety preserved
    },
    ["posts"],
    {
      tags: ["posts"],
      revalidate: 3600,
    },
  )();
}
