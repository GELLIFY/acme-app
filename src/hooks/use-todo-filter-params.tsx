import { useQueryStates } from "nuqs";

import { todoFilterParamsSchema } from "@/shared/validators/todo.schema";

export function useTodoFilterParams() {
  const [filter, setFilter] = useQueryStates(todoFilterParamsSchema);

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some((value) => value !== null),
  };
}
