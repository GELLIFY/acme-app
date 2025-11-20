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
import { createTRPCRouter, protectedProcedure } from "../init";

export const todoRouter = createTRPCRouter({
  get: protectedProcedure
    .input(getTodosSchema)
    .query(async ({ ctx: { db, session }, input }) => {
      return await getTodos(db, input, session.user.id);
    }),

  upsert: protectedProcedure
    .input(upsertTodoSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      return await upsertTodo(db, input, session.user.id);
    }),

  delete: protectedProcedure
    .input(getTodoByIdSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      return await deleteTodo(db, input, session.user.id);
    }),
});
