"server-only";

import { and, desc, eq, ilike } from "drizzle-orm";
import type { DBClient } from "@/server/db";
import { tasks_table } from "@/server/db/schema/tasks";

type GetTasksRequest = {
  text?: string | null;
  workflowStatus?: string | null;
  planningStatus?: string | null;
  priority?: string | null;
};

export async function getTasksQuery(db: DBClient, filters: GetTasksRequest) {
  // @ts-expect-error placeholder condition incase we don't have any filters
  const where = [eq(1, 1)];

  if (filters?.text) {
    where.push(ilike(tasks_table.title, filters.text));
  }

  if (filters?.workflowStatus) {
    where.push(eq(tasks_table.workflow_status, filters.workflowStatus));
  }

  if (filters?.planningStatus) {
    where.push(eq(tasks_table.planning_status, filters.planningStatus));
  }

  if (filters?.priority) {
    where.push(eq(tasks_table.priority, filters.priority));
  }

  return await db
    .select({
      id: tasks_table.id,
      title: tasks_table.title,
      userId: tasks_table.userId,
      workflow_status: tasks_table.workflow_status,
      planning_status: tasks_table.planning_status,
      priority: tasks_table.priority,
    })
    .from(tasks_table)
    .where(and(...where))
    .orderBy(desc(tasks_table.createdAt));
}

type GetTaskByIdRequest = {
  id: string;
};

export async function getTaskDetailsByIdQuery(
  db: DBClient,
  params: GetTaskByIdRequest,
) {
  return await db
    .select()
    .from(tasks_table)
    .where(eq(tasks_table.id, params.id))
    .limit(1);
}

export async function getTasksByIdQuery(
  db: DBClient,
  params: GetTaskByIdRequest,
) {
  const [result] = await db
    .select({
      id: tasks_table.id,
    })
    .from(tasks_table)
    .where(eq(tasks_table.id, params.id))
    .limit(1);

  return result;
}
