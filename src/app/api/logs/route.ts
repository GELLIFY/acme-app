import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/shared/infrastructure/logger";
import type { BrowserLogEntry } from "@/shared/infrastructure/logger/types";
import { initializeLogsExporter } from "@/shared/infrastructure/otel/logs-exporter";

export const runtime = "nodejs";

initializeLogsExporter();

const isLogEntryArray = (payload: unknown): payload is BrowserLogEntry[] =>
  Array.isArray(payload);

export async function POST(request: NextRequest) {
  try {
    const logs = await request.json();

    if (!isLogEntryArray(logs)) {
      return NextResponse.json(
        { error: "Invalid logs payload" },
        { status: 400 },
      );
    }

    for (const logEntry of logs) {
      const { level, message, context, error } = logEntry;
      const enrichedContext = {
        ...context,
        source: "browser",
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      };

      let reconstructedError: Error | undefined;
      if (error) {
        reconstructedError = new Error(error.message);
        reconstructedError.name = error.name;
        if (error.stack) {
          reconstructedError.stack = error.stack;
        }
      }

      switch (level) {
        case "debug":
          logger.debug(enrichedContext, message);
          break;
        case "info":
          logger.info(enrichedContext, message);
          break;
        case "warn":
          logger.warn(enrichedContext, message);
          break;
        case "error":
          if (reconstructedError) {
            logger.error(reconstructedError, message, enrichedContext);
          } else {
            logger.error(enrichedContext, message);
          }
          break;
        default:
          logger.info(enrichedContext, message);
      }
    }

    return NextResponse.json({ success: true, processed: logs.length });
  } catch (error) {
    logger.error(error as Error, "Failed to process browser logs");
    return NextResponse.json(
      { error: "Failed to process logs" },
      { status: 500 },
    );
  }
}
