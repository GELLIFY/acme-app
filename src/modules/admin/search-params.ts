import { useQueryStates } from "nuqs";
import { createLoader, type Options, parseAsString } from "nuqs/server";

const searchParams = {
  query: parseAsString.withDefault(""),
};

export const loadFilters = createLoader(searchParams);

export const useFilters = (options: Options = {}) =>
  useQueryStates(searchParams, { ...options, shallow: false });
