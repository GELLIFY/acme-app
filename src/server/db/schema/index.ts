import * as auth from "./auth-schema";
import * as todo from "./todos";

export const schema = { ...auth, ...todo };
