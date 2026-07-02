import { describe, expect, it } from "bun:test";
import {
  browserErrorReportSchema,
  browserLogEntrySchema,
  browserLogsSchema,
  MAX_LOG_ENTRIES,
} from "./telemetry.schema";

describe("browserLogEntrySchema / browserLogsSchema", () => {
  it("accepts a realistic entry", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "info" as const,
      message: "User signed in",
      context: { userId: "123", traceId: "abc", spanId: "def" },
    };

    const result = browserLogsSchema.safeParse([entry]);
    expect(result.success).toBe(true);
  });

  it("accepts an entry with an error object", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "error" as const,
      message: "Something broke",
      context: {},
      error: {
        name: "TypeError",
        message: "Cannot read property of undefined",
        stack: "TypeError: Cannot read property of undefined\n  at foo.js:1:1",
      },
    };

    const result = browserLogsSchema.safeParse([entry]);
    expect(result.success).toBe(true);
  });

  it("rejects an array of MAX_LOG_ENTRIES + 1 entries", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "info" as const,
      message: "spam",
      context: {},
    };

    const tooMany = Array.from({ length: MAX_LOG_ENTRIES + 1 }, () => entry);
    const result = browserLogsSchema.safeParse(tooMany);
    expect(result.success).toBe(false);
  });

  it("rejects a message over 4,000 chars", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "info" as const,
      message: "a".repeat(4_001),
      context: {},
    };

    const result = browserLogEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });

  it("rejects an unknown level", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "trace",
      message: "hello",
      context: {},
    };

    const result = browserLogEntrySchema.safeParse(entry);
    expect(result.success).toBe(false);
  });

  it("strips unknown top-level fields rather than failing", () => {
    const entry = {
      timestamp: new Date().toISOString(),
      level: "info" as const,
      message: "hello",
      context: {},
      unknownField: "should be stripped",
    };

    const result = browserLogEntrySchema.safeParse(entry);
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("unknownField");
  });
});

describe("browserErrorReportSchema", () => {
  it("rejects a payload without message", () => {
    const result = browserErrorReportSchema.safeParse({
      name: "Error",
      stack: "Error\n  at foo.js:1:1",
    });

    expect(result.success).toBe(false);
  });
});
