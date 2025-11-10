import {
  deleteTask,
  getTaskDetailsById,
  getTasks,
  getTasksById,
  upsertTask,
} from "@/server/domains/tasks/tasks-service";
import {
  getTasksByIdSchema,
  getTasksSchema,
  upsertTaskSchema,
} from "@/shared/validators/tasks.schema";
import { createTRPCRouter, publicProcedure } from "../init";

export const tasksRouter = createTRPCRouter({
  get: publicProcedure
    .input(getTasksSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await getTasks(db, input);
    }),
  
  getAll: publicProcedure
    .query(async ({ ctx: { db } }) => {
    return await getTasks(db, {});
  }),

  getDetailsById: publicProcedure
    .input(getTasksByIdSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await getTaskDetailsById(db, input);
    }),

  getById: publicProcedure
    .input(getTasksByIdSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await getTasksById(db, input);
    }),

  upsert: publicProcedure
    .input(upsertTaskSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await upsertTask(db, input);
    }),

  delete: publicProcedure
    .input(getTasksByIdSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      return await deleteTask(db, input);
    }),
});
