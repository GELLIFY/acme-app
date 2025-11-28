import { describe, expect, test } from "bun:test";
import { testClient } from "hono/testing";
import { routers } from "../init";

describe("tasks routes", () => {
  // Create the test client from the app instance
  const client = testClient(routers);

  test("post /todos validates the body when creating", async () => {
    const response = await client.todos.$post({
      json: {
        text: "X",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]!.code).toBe("too_small");
      expect(json.error.issues[0]!.path[0]).toBe("text");
    }
  });

  // const id = 1;
  // const name = "Learn vitest";

  // test("post /tasks creates a task", async () => {
  //   const response = await client.tasks.$post({
  //     json: {
  //       name,
  //       done: false,
  //     },
  //   });
  //   expect(response.status).toBe(200);
  //   if (response.status === 200) {
  //     const json = await response.json();
  //     expect(json.name).toBe(name);
  //     expect(json.done).toBe(false);
  //   }
  // });

  // test("get /tasks lists all tasks", async () => {
  //   const response = await client.tasks.$get();
  //   expect(response.status).toBe(200);
  //   if (response.status === 200) {
  //     const json = await response.json();
  //     expectTypeOf(json).toBeArray();
  //     expect(json.length).toBe(1);
  //   }
  // });

  // test("get /tasks/{id} validates the id param", async () => {
  //   const response = await client.tasks[":id"].$get({
  //     param: {
  //       id: "wat",
  //     },
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     expect(json.error.issues[0].path[0]).toBe("id");
  //     expect(json.error.issues[0].message).toBe(
  //       ZOD_ERROR_MESSAGES.EXPECTED_NUMBER,
  //     );
  //   }
  // });

  // test("get /tasks/{id} returns 404 when task not found", async () => {
  //   const response = await client.tasks[":id"].$get({
  //     param: {
  //       id: 999,
  //     },
  //   });
  //   expect(response.status).toBe(404);
  //   if (response.status === 404) {
  //     const json = await response.json();
  //     expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
  //   }
  // });

  // test("get /tasks/{id} gets a single task", async () => {
  //   const response = await client.tasks[":id"].$get({
  //     param: {
  //       id,
  //     },
  //   });
  //   expect(response.status).toBe(200);
  //   if (response.status === 200) {
  //     const json = await response.json();
  //     expect(json.name).toBe(name);
  //     expect(json.done).toBe(false);
  //   }
  // });

  // test("patch /tasks/{id} validates the body when updating", async () => {
  //   const response = await client.tasks[":id"].$patch({
  //     param: {
  //       id,
  //     },
  //     json: {
  //       name: "",
  //     },
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     expect(json.error.issues[0].path[0]).toBe("name");
  //     expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
  //   }
  // });

  // test("patch /tasks/{id} validates the id param", async () => {
  //   const response = await client.tasks[":id"].$patch({
  //     param: {
  //       id: "wat",
  //     },
  //     json: {},
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     expect(json.error.issues[0].path[0]).toBe("id");
  //     expect(json.error.issues[0].message).toBe(
  //       ZOD_ERROR_MESSAGES.EXPECTED_NUMBER,
  //     );
  //   }
  // });

  // test("patch /tasks/{id} validates empty body", async () => {
  //   const response = await client.tasks[":id"].$patch({
  //     param: {
  //       id,
  //     },
  //     json: {},
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
  //     expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
  //   }
  // });

  // test("patch /tasks/{id} updates a single property of a task", async () => {
  //   const response = await client.tasks[":id"].$patch({
  //     param: {
  //       id,
  //     },
  //     json: {
  //       done: true,
  //     },
  //   });
  //   expect(response.status).toBe(200);
  //   if (response.status === 200) {
  //     const json = await response.json();
  //     expect(json.done).toBe(true);
  //   }
  // });

  // test("delete /tasks/{id} validates the id when deleting", async () => {
  //   const response = await client.tasks[":id"].$delete({
  //     param: {
  //       id: "wat",
  //     },
  //   });
  //   expect(response.status).toBe(422);
  //   if (response.status === 422) {
  //     const json = await response.json();
  //     expect(json.error.issues[0].path[0]).toBe("id");
  //     expect(json.error.issues[0].message).toBe(
  //       ZOD_ERROR_MESSAGES.EXPECTED_NUMBER,
  //     );
  //   }
  // });

  // test("delete /tasks/{id} removes a task", async () => {
  //   const response = await client.tasks[":id"].$delete({
  //     param: {
  //       id,
  //     },
  //   });
  //   expect(response.status).toBe(204);
  // });
});
