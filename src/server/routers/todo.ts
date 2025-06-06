import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "@/shared/validators/post.schema";
import { createTodo, deleteTodo, updateTodo } from "../domain/todo/commands";
import { getTodosQuery } from "../domain/todo/queries";
import { createTRPCRouter, publicProcedure } from "../lib/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await getTodosQuery();
  }),

  create: publicProcedure
    .input(createTodoSchema)
    .mutation(async ({ input }) => {
      return await createTodo(input);
    }),

  update: publicProcedure
    .input(updateTodoSchema)
    .mutation(async ({ input }) => {
      return await updateTodo(input);
    }),

  delete: publicProcedure
    .input(deleteTodoSchema)
    .mutation(async ({ input }) => {
      return await deleteTodo(input);
    }),
});
