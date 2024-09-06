import type { InferInsertModel } from "drizzle-orm";

import type { schema } from "..";

export const postsMock = [
  {
    id: 999,
    title: "title",
    content: "content",
  },
] satisfies InferInsertModel<typeof schema.post>[];
