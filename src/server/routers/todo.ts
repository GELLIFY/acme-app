import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "@/shared/validators/post.schema";
import { createTodo, deleteTodo, updateTodo } from "../domain/todo/mutations";
import { createTRPCRouter, publicProcedure } from "../lib/trpc";
import { getTodos } from "../services/todo-service";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return await getTodos();
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
