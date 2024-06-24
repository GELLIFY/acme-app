import type { InferInsertModel } from "drizzle-orm";

import type { schema } from "..";

export const postsMock = [
  {
    id: 1,
    title: "title",
    content: "content",
  },
] satisfies InferInsertModel<typeof schema.post>[];
