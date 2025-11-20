import { beforeEach, expect, test } from "bun:test";
import { randomUUIDv7 } from "bun";
import { db } from "@/server/db";
import { user as userTable } from "@/server/db/schema/auth-schema";
import { deleteTodo, getTodoById, getTodos, upsertTodo } from "./todo-service";

const userId = randomUUIDv7();

beforeEach(async () => {
  await db
    .insert(userTable)
    .values({ id: userId, email: "test@test.com", name: "test" })
    .onConflictDoNothing();
});

test("create todo", async () => {
  const todo = await upsertTodo(db, { text: "text" }, userId);

  expect(todo).toBeDefined();
  expect(todo?.text).toEqual("text");
});

test("list todos - empty", async () => {
  const todos = await getTodos(db, {}, userId);

  expect(todos.length).toEqual(0);
});

test("list todos - one user", async () => {
  await upsertTodo(db, { text: "text" }, userId);
  const todos = await getTodos(db, {}, userId);

  expect(todos.length).toEqual(1);
});

test("update todo", async () => {
  const todo = await upsertTodo(db, { text: "text" }, userId);
  const updatedTodo = await upsertTodo(
    db,
    {
      id: todo.id,
      text: "text-updated",
    },
    userId,
  );

  expect(updatedTodo?.text).toEqual("text-updated");
});

test("delete todo", async () => {
  const todo = await upsertTodo(db, { text: "text" }, userId);
  await deleteTodo(db, { id: todo.id }, userId);
  const deletedTodo = await getTodoById(db, { id: todo.id }, userId);

  expect(deletedTodo).toBeUndefined();
});
