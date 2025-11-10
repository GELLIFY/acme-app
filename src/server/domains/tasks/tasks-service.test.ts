import { expect, test } from "bun:test";
import {
  TaskPlanningStatus,
  TaskPriority,
  TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";
import { db } from "@/server/db";
import {
  deleteTask,
  getTasks,
  getTasksById,
  upsertTask,
} from "./tasks-service";

const TEST_TASK = {
  userId: "no-user",
  title: "Test Task",
  workflow_status: TaskWorkflowStatus.OPEN,
  planning_status: TaskPlanningStatus.BACKLOG,
  priority: TaskPriority.LOW,
};

test("create user", async () => {
  const task = await upsertTask(db, { ...TEST_TASK });

  expect(task).toBeDefined();
  expect(task?.title).toEqual(TEST_TASK.title);
});

test("list tasks - empty", async () => {
  const tasks = await getTasks(db, {});

  expect(tasks.length).toEqual(0);
});

test("list tasks - one user", async () => {
  await upsertTask(db, { ...TEST_TASK });
  const tasks = await getTasks(db, {});

  expect(tasks.length).toEqual(1);
});

test("update task", async () => {
  const task = await upsertTask(db, { ...TEST_TASK });
  const updatedTask = await upsertTask(db, {
    id: task.id,
    title: "text-updated",
    workflow_status: TaskWorkflowStatus.DONE,
    planning_status: TaskPlanningStatus.DONE,
    priority: TaskPriority.HIGH,
  });

  expect(updatedTask?.title).toEqual("text-updated");
  expect(updatedTask?.workflow_status).toEqual(TaskWorkflowStatus.DONE);
  expect(updatedTask?.planning_status).toEqual(TaskPlanningStatus.DONE);
  expect(updatedTask?.priority).toEqual(TaskPriority.HIGH);
});

test("delete task", async () => {
  const task = await upsertTask(db, { ...TEST_TASK });
  await deleteTask(db, { id: task.id });
  const deletedTask = await getTasksById(db, { id: task.id });

  expect(deletedTask).toBeUndefined();
});
