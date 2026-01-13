import { browserLogger } from "./browser-logger";
import { serverLogger } from "./pino-logger";

export const logger =
  typeof window === "undefined" ? serverLogger : browserLogger;
