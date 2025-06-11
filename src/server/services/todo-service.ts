"server-only";

import { shuffleTodos } from "../domain/todo/helpers";
import { getTodosQuery } from "../domain/todo/queries";

export async function getTodos() {
  const todos = await getTodosQuery();

  // NOTE: do whatever you want here, map, aggregate filter...
  // result will be cached and typesafety preserved
  return shuffleTodos(todos);
}
