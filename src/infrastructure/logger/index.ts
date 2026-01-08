import { clientLogger } from "./client";
import { serverLogger } from "./server";

export const logger =
  typeof window === "undefined" ? serverLogger : clientLogger;
