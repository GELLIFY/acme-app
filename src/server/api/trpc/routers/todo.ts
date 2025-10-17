import {
  deleteTodo,
  getTodos,
  upsertTodo,
} from "@/server/domains/todo/todo-service";
import {
  getTodoByIdSchema,
  getTodosSchema,
  upsertTodoSchema,
} from "@/shared/validators/todo.schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const todoRouter = createTRPCRouter({
  get: publicProcedure
    .input(getTodosSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await getTodos(db, input);
    }),

  upsert: publicProcedure
    .input(upsertTodoSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await upsertTodo(db, input);
    }),

  delete: publicProcedure
    .input(getTodoByIdSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await deleteTodo(db, input);
    }),
});
