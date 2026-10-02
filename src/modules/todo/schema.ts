import { todoRelations, todoTable } from "./tables";

export const todo = {
  id: "example",
  tables: { todoTable, todoRelations },
} as const;
