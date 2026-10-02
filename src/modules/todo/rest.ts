import { todosRouter } from "./server/rest-routes";

// What the example module adds to the REST API, and only to it: with this
// file, `server/rest-routes.ts` and its test, it goes when the API does.
export const todo = {
  id: "example",
  routes: [{ path: "/todos", router: todosRouter }],
} as const;
