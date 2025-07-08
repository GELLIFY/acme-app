import { useQueryStates } from "nuqs";

import { todoParamsSchema } from "@/shared/validators/todo.schema";

export function useTodoParams() {
  const [params, setParams] = useQueryStates(todoParamsSchema);

  return {
    params,
    setParams,
  };
}
