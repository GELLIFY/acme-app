import { useQueryStates } from "nuqs";
import {
  createLoader,
  type Options,
  parseAsBoolean,
  parseAsString,
} from "nuqs/server";

const searchParams = {
  text: parseAsString,
  completed: parseAsBoolean,
};

export const loadTodoFilters = createLoader(searchParams);

export const useTodoFilters = (options: Options = {}) =>
  useQueryStates(searchParams, { ...options, shallow: false });
