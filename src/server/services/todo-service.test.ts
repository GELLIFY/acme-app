import { expect, test } from "bun:test";

import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "./todo-service";

test("create user", async () => {
  const todo = await createTodo({ text: "text" });

  expect(todo).toBeDefined();
  expect(todo?.text).toEqual("text");
});

test("list todos - empty", async () => {
  const todos = await getTodos();

  expect(todos.length).toEqual(0);
});

test("list todos - one user", async () => {
  await createTodo({ text: "text" });
  const todos = await getTodos();

  expect(todos.length).toEqual(1);
});

test("update todo", async () => {
  const todo = await createTodo({ text: "text" });
  const updatedTodo = await updateTodo({
    id: todo!.id,
    text: "text-updated",
  });

  expect(updatedTodo?.text).toEqual("text-updated");
});

test("delete todo", async () => {
  const todo = await createTodo({ text: "text" });
  await deleteTodo({ id: todo!.id });
  const deletedTodo = await getTodoById({ id: todo!.id });

  expect(deletedTodo).toBeUndefined();
});
