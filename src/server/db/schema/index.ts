import * as auth from "./auth-schema";
import * as task from "./tasks";
import * as todo from "./todos";

export const schema = { ...auth, ...todo, ...task };
