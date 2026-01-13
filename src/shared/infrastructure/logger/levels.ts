import type { LogLevel } from "./types";

export const toLogLevel = (label: string): LogLevel => {
  switch (label) {
    case "fatal":
      return "error";
    case "trace":
      return "debug";
    case "debug":
    case "info":
    case "warn":
    case "error":
      return label;
    default:
      return "info";
  }
};
