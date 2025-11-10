import type { getTasksQuery } from "./queries";

type Task = Awaited<ReturnType<typeof getTasksQuery>>[number];

export function shuffleTasks(tasks: Task[]): Task[] {
  // create copy
  const result = [...tasks];

  // sort copy in place
  return result.sort(() => (Math.random() > 0.5 ? -1 : 1));
}
