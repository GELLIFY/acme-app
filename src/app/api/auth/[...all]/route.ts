import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/libs/better-auth/auth";

export const { POST, GET } = toNextJsHandler(auth);
