import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/shared/helpers/better-auth/auth";

export const { POST, GET } = toNextJsHandler(auth);
