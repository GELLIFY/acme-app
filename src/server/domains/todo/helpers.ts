import type { getTodosQuery } from "./queries";

type Todo = Awaited<ReturnType<typeof getTodosQuery>>[number];

export function shuffleTodos(todos: Todo[]): Todo[] {
  // create copy
  const result = [...todos];

  // sort copy in place
  return result.sort(() => (Math.random() > 0.5 ? -1 : 1));
}
