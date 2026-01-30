import { type NextRequest, NextResponse } from "next/server";
import { initializeLogsExporter } from "@/shared/infrastructure/logger/log-exporter";
import { type LogEntry, logger } from "@/shared/infrastructure/logger/logger";

// Initialize the OTLP exporter when this route is first hit
initializeLogsExporter();

export async function POST(request: NextRequest) {
  try {
    const logs = (await request.json()) as LogEntry[];
    if (!Array.isArray(logs)) {
      return NextResponse.json(
        { error: "Invalid logs payload" },
        { status: 400 },
      );
    }

    for (const logEntry of logs) {
      const { level, message, context, error } = logEntry;

      // Enrich with server-side context
      const enrichedContext = {
        ...context,
        source: "browser", // Flag this log as coming from the client
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
      };

      // Re-construct the error object on the server
      let err: Error | undefined;
      if (error) {
        err = new Error(error.message);
        err.name = error.name;
        err.stack = error.stack;
      }

      // Use our server-side logger to forward the log
      switch (level) {
        case "debug":
          logger.debug(message, enrichedContext);
          break;
        case "info":
          logger.info(message, enrichedContext);
          break;
        case "warn":
          logger.warn(message, enrichedContext);
          break;
        case "error": {
          logger.error(message, err, enrichedContext);
          break;
        }
        default:
          logger.info(message, enrichedContext);
      }
    }

    return NextResponse.json({ success: true, processed: logs.length });
  } catch (error) {
    // Log errors from the logging endpoint itself
    logger.error("Failed to process browser logs", error as Error);
    return NextResponse.json(
      { error: "Failed to process browser logs" },
      { status: 500 },
    );
  }
}
