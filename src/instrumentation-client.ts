import { browserLogger } from "./shared/infrastructure/logger/browser-logger";

// Set up error tracking
window.onerror = (message, source, lineno, colno, error) => {
  browserLogger.error(
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
  browserLogger.error(
    "Unhandled promise rejection",
    event.reason || new Error("Unknown rejection reason"),
    {
      source: "window.onunhandledrejection",
    },
  );
};

console.log("✅ Global error handlers initialized");
