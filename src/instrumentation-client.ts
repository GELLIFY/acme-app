import { logger } from "./shared/infrastructure/logger/pino-logger";

// Set up error tracking
window.onerror = (message, source, lineno, colno, error) => {
  logger.error(
    `Unhandled error: ${message}`,
    error || new Error(message as string),
    {
      source: "window.onerror",
      sourceFile: source,
      line: lineno,
      column: colno,
    },
  );
};

window.onunhandledrejection = (event) => {
  logger.error(
    "Unhandled promise rejection",
    event.reason || new Error("Unknown rejection reason"),
    {
      source: "window.onunhandledrejection",
    },
  );
};

console.log("✅ Global error handlers initialized");
