import {
  createTodo,
  deleteTodo,
  updateTodo,
} from "@/server/domain/todo/mutations";
import { getTodos } from "@/server/services/todo-service";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "@/shared/validators/post.schema";
import { createTRPCRouter, publicProcedure } from "../init";

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
