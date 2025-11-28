import { describe, expect, expectTypeOf, test } from "bun:test";
import { testClient } from "hono/testing";
import { db } from "@/server/db";
import { todoTable } from "@/server/db/schema/todos";
import { routers } from "../init";

const userId = "00000000-0000-0000-0000-000000000000";

async function createMockTodo() {
  const [todo] = await db
    .insert(todoTable)
    .values({ text: "text", userId })
    .returning();

  if (!todo) {
    throw new Error("Error creating a mock todo");
  }

  return todo;
}

describe("todos routes", () => {
  // Create the test client from the app instance
  const client = testClient(routers);

  test("post /todos validates the body when creating", async () => {
    const response = await client.todos.$post({
      json: { text: "X" },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]!.code).toBe("too_small");
      expect(json.error.issues[0]!.path[0]).toBe("text");
    }
  });

  test("post /todos creates a todo", async () => {
    const text = "Learn vitest";
    const response = await client.todos.$post({
      json: { text: text },
    });

    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.text).toBe(text);
      expect(json.completed).toBe(false);
    }
  });

  test("get /todos lists all todos", async () => {
    await client.todos.$post({ json: { text: "text" } });
    const response = await client.todos.$get({ query: {} });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  test("get /todos/{id} validates the id param", async () => {
    const response = await client.todos[":id"].$get({
      param: { id: "not_a_uuid" },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]!.code).toBe("invalid_format");
      expect(json.error.issues[0]!.path[0]).toBe("id");
    }
  });

  test("get /todos/{id} returns 404 when todo not found", async () => {
    const response = await client.todos[":id"].$get({
      param: { id: "00000000-0000-0000-0000-000000000000" },
    });

    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe("Todo not found");
    }
  });

  test("get /todos/{id} gets a single todo", async () => {
    const expected = await createMockTodo();
    const response = await client.todos[":id"].$get({
      param: { id: expected.id },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const actual = await response.json();
      expect(actual.id).toBe(expected.id);
      expect(actual.text).toBe(expected.text);
      expect(actual.completed).toBe(expected.completed);
    }
  });

  test("patch /todos/{id} validates the body when updating", async () => {
    const expected = await createMockTodo();
    const response = await client.todos[":id"].$patch({
      param: { id: expected.id },
      json: { text: "up" },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]!.code).toBe("too_small");
      expect(json.error.issues[0]!.path[0]).toBe("text");
    }
  });

  test("patch /todos/{id} updates a single property of a todo", async () => {
    const expected = await createMockTodo();
    const response = await client.todos[":id"].$patch({
      param: { id: expected.id },
      json: { completed: true },
    });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.completed).toBe(true);
    }
  });

  test("delete /todos/{id} validates the id when deleting", async () => {
    const response = await client.todos[":id"].$delete({
      param: { id: "wat" },
    });

    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]!.code).toBe("invalid_format");
      expect(json.error.issues[0]!.path[0]).toBe("id");
    }
  });

  test("get /todos/{id} returns 404 when todo not found", async () => {
    const response = await client.todos[":id"].$delete({
      param: { id: "00000000-0000-0000-0000-000000000000" },
    });

    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe("Todo not found");
    }
  });

  test("delete /todos/{id} removes a todo", async () => {
    const expected = await createMockTodo();
    const response = await client.todos[":id"].$delete({
      param: { id: expected.id },
    });

    expect(response.status).toBe(204);
  });
});
