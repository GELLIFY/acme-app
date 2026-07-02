import * as z from "zod";

export const MAX_LOG_ENTRIES = 50;

const logErrorSchema = z.object({
  name: z.string().max(256).optional(),
  message: z.string().max(4_000),
  stack: z.string().max(20_000).optional(),
});

export const browserLogEntrySchema = z.object({
  timestamp: z.string().max(64),
  level: z.enum(["debug", "info", "warn", "error"]),
  message: z.string().max(4_000),
  context: z.record(z.string().max(128), z.unknown()).optional(),
  error: logErrorSchema.optional(),
});

export const browserLogsSchema = z
  .array(browserLogEntrySchema)
  .max(MAX_LOG_ENTRIES);

export const browserErrorReportSchema = logErrorSchema;
