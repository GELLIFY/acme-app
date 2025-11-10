import { z } from "@hono/zod-openapi"; // Extended Zod instance
import { parseAsString, parseAsStringEnum } from "nuqs/server";
import {
  TaskPlanningStatus,
  TaskPriority,
  TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";

1;
export const getTasksSchema = z.object({
  title: z.string().nullable().optional().openapi({
    description: "Filter tasks by title",
    example: "task",
  }),
  workflow_status: z.enum(TaskWorkflowStatus).nullable().optional().openapi({
    description: "Filter tasks by workflow status",
    example: "OPEN",
  }),
  planning_status: z.enum(TaskPlanningStatus).nullable().optional().openapi({
    description: "Filter tasks by planning status",
    example: "BACKLOG",
  }),
  priority: z.enum(TaskPriority).nullable().optional().openapi({
    description: "Filter tasks by priority",
    example: "MEDIUM",
  }),
});

export const getTasksByIdSchema = z.object({
  id: z.guid().openapi({
    description: "Unique identifier of the task to retrieve",
    example: "b3b7c1e2-4c2a-4e7a-9c1a-2b7c1e24c2a4",
    param: {
      in: "path",
      name: "id",
    },
  }),
});

export const upsertTaskSchema = z.object({
  id: z
    .guid()
    .optional()
    .openapi({
      description: "The ID of the task to update.",
      example: "b3b7c8e2-1f2a-4c3d-9e4f-5a6b7c8d9e0f",
      param: {
        in: "path",
        name: "id",
      },
    }),
  userId: z
    .union([z.guid(), z.literal("no-user")])
    .optional()
    .openapi({
      description: "The ID of the user who owns the task.",
      example: "a1a2a3a4-5b6c-7d8e-9f0a-b1c2d3e4f5g6",
    }),
  title: z.string().min(3).openapi({
    description: "The new title of the task.",
    example: "Update the doc v2",
  }),
  workflow_status: z.enum(TaskWorkflowStatus).openapi({
    description: "The new workflow status of the task.",
    example: "IN_PROGRESS",
  }),
  planning_status: z.enum(TaskPlanningStatus).openapi({
    description: "The new planning status of the task.",
    example: "TODO",
  }),
  priority: z.enum(TaskPriority).openapi({
    description: "The new priority of the task.",
    example: "HIGH",
  }),
  updatedAt: z.date().optional().openapi({
    description: "The date and time when the task was last updated.",
    example: "2023-03-15T12:34:56Z",
  }),
});

export type TasksSchema = z.infer<typeof upsertTaskSchema>;

export const tasksFilterParamsSchema = {
  title: parseAsString,
  workflow_status: parseAsStringEnum(Object.values(TaskWorkflowStatus)),
  planning_status: parseAsStringEnum(Object.values(TaskPlanningStatus)),
  priority: parseAsStringEnum(Object.values(TaskPriority)),
};
