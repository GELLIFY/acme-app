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
  get: publicProcedure.input(getTodosSchema).query(async ({ input }) => {
    return await getTodos(input);
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
