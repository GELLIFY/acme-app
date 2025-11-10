import { index, pgEnum } from "drizzle-orm/pg-core";
import {
  TaskPlanningStatus,
  TaskPriority,
  TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";
import { timestamps } from "../utils";
import { createTable } from "./_table";
import { user } from "./auth-schema";

export const TaskWorkflowStatusEnum = pgEnum(
  "TaskWorkflowStatusEnum",
  Object.values(TaskWorkflowStatus) as [string, ...string[]],
);

export const TaskPlanningStatusEnum = pgEnum(
  "TaskPlanningStatusEnum",
  Object.values(TaskPlanningStatus) as [string, ...string[]],
);

export const TaskPriorityEnum = pgEnum(
  "TaskPriorityEnum",
  Object.values(TaskPriority) as [string, ...string[]],
);

export const tasks_table = createTable(
  "tasks_table",
  (d) => ({
    id: d.uuid().defaultRandom().primaryKey().notNull(),
    userId: d.uuid().references(() => user.id),
    title: d.varchar({ length: 256 }).notNull(),
    workflow_status: TaskWorkflowStatusEnum().default("OPEN").notNull(),
    planning_status: TaskPlanningStatusEnum().default("BACKLOG").notNull(),
    priority: TaskPriorityEnum().default("LOW").notNull(),
    ...timestamps,
  }),
  (t) => [index("title_idx").on(t.title)],
);

export type DB_TasksType = typeof tasks_table.$inferSelect;
export type DB_TasksInsertType = typeof tasks_table.$inferInsert;
