import { todoRouter } from "./server/trpc-router";

export const todo = {
  id: "example",
  routers: { todo: todoRouter },
} as const;
