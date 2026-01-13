import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/infrastructure/better-auth/auth";

export const { POST, GET } = toNextJsHandler(auth);
