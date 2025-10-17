import { expect, test } from "bun:test";
import { db } from "@/server/db";
import { deleteTodo, getTodoById, getTodos, upsertTodo } from "./todo-service";

test("create user", async () => {
  const todo = await upsertTodo(db, { text: "text" });

  expect(todo).toBeDefined();
  expect(todo?.text).toEqual("text");
});

test("list todos - empty", async () => {
  const todos = await getTodos(db, {});

  expect(todos.length).toEqual(0);
});

test("list todos - one user", async () => {
  await upsertTodo(db, { text: "text" });
  const todos = await getTodos(db, {});

  expect(todos.length).toEqual(1);
});

test("update todo", async () => {
  const todo = await upsertTodo(db, { text: "text" });
  const updatedTodo = await upsertTodo(db, {
    id: todo.id,
    text: "text-updated",
  });

  expect(updatedTodo?.text).toEqual("text-updated");
});

test("delete todo", async () => {
  const todo = await upsertTodo(db, { text: "text" });
  await deleteTodo(db, { id: todo.id });
  const deletedTodo = await getTodoById(db, { id: todo.id });

  expect(deletedTodo).toBeUndefined();
});
