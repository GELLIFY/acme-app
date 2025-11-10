"server-only";

import { eq } from "drizzle-orm";

import type { DBClient } from "@/server/db";
import { tasks_table } from "@/server/db/schema/tasks";

type UpsertTasksParams = {
  id?: string;
  userId?: string;
  title: string;
  workflow_status: string;
  planning_status: string;
  priority: string;
};

export async function upsertTasksMutation(
  db: DBClient,
  params: UpsertTasksParams,
) {
  const { id, ...rest } = params;

  const [task] = await db
    .insert(tasks_table)
    .values({ id, ...rest })
    .onConflictDoUpdate({
      target: tasks_table.id,
      set: {
        userId: rest.userId ?? null,
        title: rest.title,
        workflow_status: rest.workflow_status,
        planning_status: rest.planning_status,
        priority: rest.priority,
      },
    })
    .returning();

  if (!task) {
    throw new Error("Failed to create or update task");
  }

  return task;
}

type DeleteTaskParams = {
  id: string;
};

export async function deleteTasksMutation(
  db: DBClient,
  params: DeleteTaskParams,
) {
  const [result] = await db
    .delete(tasks_table)
    .where(eq(tasks_table.id, params.id))
    .returning({
      id: tasks_table.id,
      title: tasks_table.title,
    });

  return result;
}
