import { unstable_cache } from "next/cache";

import { getTodosQuery } from "../domain/todo/queries";

export async function getTodos() {
  return unstable_cache(
    async () => {
      return await getTodosQuery();

      // NOTE: do whatever you want here, map, aggregate filter...
      // result will be cached and typesafety preserved
    },
    ["todos"],
    {
      tags: ["todos"],
      revalidate: 3600,
    },
  )();
}
