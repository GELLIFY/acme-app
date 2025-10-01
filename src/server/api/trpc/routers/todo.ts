import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@/server/services/todo-service";
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const todoRouter = createTRPCRouter({
  get: publicProcedure
    .input(getTodosSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await getTodos(db, input);
    }),

  create: publicProcedure
    .input(createTodoSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await createTodo(db, input);
    }),

  update: publicProcedure
    .input(updateTodoSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await updateTodo(db, input);
    }),

  delete: publicProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await deleteTodo(db, input);
    }),
});
