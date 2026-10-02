import { tablesOf } from "@/modules/registry";
import { schemaModules } from "@/modules/schema";
import * as auth from "./auth-schema";
import * as todo from "./todos";

/** The tables of the app, then those of the optional modules (`schema.ts`). */
export const schema = { ...auth, ...todo, ...tablesOf(schemaModules) };
