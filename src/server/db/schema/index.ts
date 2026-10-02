import { tablesOf } from "@/modules/registry";
import { schemaModules } from "@/modules/schema";
import * as auth from "./auth-schema";

/** The tables of the app, then those of the optional modules (`schema.ts`). */
export const schema = { ...auth, ...tablesOf(schemaModules) };
