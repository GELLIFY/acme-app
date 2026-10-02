import type { TodoListItem } from "./todo-service";

export function shuffleTodos(todos: TodoListItem[]): TodoListItem[] {
  // create copy
  const result = [...todos];

  // sort copy in place
  return result.sort(() => (Math.random() > 0.5 ? -1 : 1));
}
