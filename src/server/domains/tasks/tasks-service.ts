"server-only";

import type z from "zod";
import type { DBClient } from "@/server/db";
import type {
  getTasksByIdSchema,
  getTasksSchema,
  upsertTaskSchema,
} from "@/shared/validators/tasks.schema";
import { deleteTasksMutation, upsertTasksMutation } from "./mutations";
import {
  getTaskDetailsByIdQuery,
  getTasksByIdQuery,
  getTasksQuery,
} from "./queries";

export async function getTasks(
  db: DBClient,
  filters: z.infer<typeof getTasksSchema>,
) {
  return await getTasksQuery(db, filters);
}

export async function getTaskDetailsById(
  db: DBClient,
  filters: z.infer<typeof getTasksByIdSchema>,
) {
  return await getTaskDetailsByIdQuery(db, filters);
}

export async function getTasksById(
  db: DBClient,
  filters: z.infer<typeof getTasksByIdSchema>,
) {
  return await getTasksByIdQuery(db, filters);
}

export async function upsertTask(
  db: DBClient,
  params: z.infer<typeof upsertTaskSchema>,
) {
  return await upsertTasksMutation(db, params);
}

export async function deleteTask(
  db: DBClient,
  params: z.infer<typeof getTasksByIdSchema>,
) {
  return await deleteTasksMutation(db, params);
}
