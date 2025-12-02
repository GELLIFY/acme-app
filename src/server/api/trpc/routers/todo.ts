import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@/server/domains/todo/todo-service";
import {
  createTodoSchema,
  getTodoByIdSchema,
  getTodosSchema,
  updateTodoSchema,
} from "@/shared/validators/todo.schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const todoRouter = createTRPCRouter({
  get: protectedProcedure
    .input(getTodosSchema)
    .query(async ({ ctx: { db, session }, input }) => {
      return await getTodos(db, input, session.user.id);
    }),

  create: protectedProcedure
    .input(createTodoSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      return await createTodo(db, input, session.user.id);
    }),

  update: protectedProcedure
    .input(updateTodoSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      return await updateTodo(db, input, session.user.id);
    }),

  delete: protectedProcedure
    .input(getTodoByIdSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      return await deleteTodo(db, input, session.user.id);
    }),
});
