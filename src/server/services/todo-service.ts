import { unstable_cache } from "next/cache";

import { shuffleTodos } from "../domain/todo/helpers";
import { getTodosQuery } from "../domain/todo/queries";

export async function getTodos() {
  return unstable_cache(
    async () => {
      const todos = await getTodosQuery();

      // NOTE: do whatever you want here, map, aggregate filter...
      // result will be cached and typesafety preserved
      return shuffleTodos(todos);
    },
    ["todos"],
    {
      tags: ["todos"],
      revalidate: 3600,
    },
  )();
}
