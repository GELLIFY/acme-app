import "dotenv/config";

import { reset, seed } from "drizzle-seed";
import {
  TaskPlanningStatus,
  TaskPriority,
  TaskWorkflowStatus,
} from "@/lib/tasks/task-utils";
import { db } from ".";
import { schema } from "./schema";
import { user } from "./schema/auth-schema";
import { tasks_table } from "./schema/tasks";
import { todo_table } from "./schema/todos";

async function main() {
  await reset(db, schema);
  await seed(db, { todo_table }).refine((f) => ({
    todo_table: {
      columns: {
        text: f.loremIpsum(),
      },
      count: 5,
    },
  }));
  await seed(db, { user }).refine((f) => ({
    user: {
      columns: {
        id: f.uuid(),
        name: f.fullName(),
        email: f.email(),
      },
      count: 1,
    },
  }));
  const users = (await db.select().from(user)).map((u) => u.id);
  console.log("Seeded users:", users);

  await seed(db, { tasks_table }).refine((f) => ({
    tasks_table: {
      columns: {
        title: f.loremIpsum(),
        userId: f.valuesFromArray({ values: users }),
        workflowStatus: f.valuesFromArray({
          values: Object.values(TaskWorkflowStatus),
        }),
        planningStatus: f.valuesFromArray({
          values: Object.values(TaskPlanningStatus),
        }),
        priority: f.valuesFromArray({ values: Object.values(TaskPriority) }),
        createdAt: f.date({
          minDate: new Date(2023, 0, 1),
          maxDate: new Date(),
        }),
        updatedAt: undefined,
      },
      count: 50,
    },
  }));

  await db.$client.end();
}

await main();
