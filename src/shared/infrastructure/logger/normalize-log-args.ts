import type { LogContext } from "./types";

export type NormalizedLogArgs = {
  message: string;
  context: LogContext;
  error?: Error;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Error);

const isErrorLike = (
  value: Record<string, unknown>,
): value is { name: string; message: string; stack?: string } =>
  typeof value.name === "string" && typeof value.message === "string";

export const normalizeLogArgs = (args: unknown[]): NormalizedLogArgs => {
  const context: LogContext = {};
  const messageParts: string[] = [];
  let error: Error | undefined;

  for (const arg of args) {
    if (arg instanceof Error) {
      error ??= arg;
      continue;
    }

    if (typeof arg === "string") {
      messageParts.push(arg);
      continue;
    }

    if (typeof arg === "number" || typeof arg === "boolean") {
      messageParts.push(String(arg));
      continue;
    }

    if (isPlainObject(arg)) {
      if (!error && isErrorLike(arg)) {
        const reconstructedError = new Error(arg.message);
        reconstructedError.name = arg.name;
        if (typeof arg.stack === "string") {
          reconstructedError.stack = arg.stack;
        }
        error = reconstructedError;
        continue;
      }
      Object.assign(context, arg);
    }
  }

  let message = messageParts.join(" ").trim();

  if (!message) {
    if (typeof context.message === "string") {
      message = context.message;
    } else if (error) {
      message = error.message;
    } else {
      message = "log";
    }
  }

  return { message, context, error };
};
