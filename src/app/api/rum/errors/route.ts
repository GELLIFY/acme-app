import { SpanStatusCode, trace } from "@opentelemetry/api";
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/shared/infrastructure/logger/logger";

export async function POST(request: NextRequest) {
  try {
    const error = (await request.json()) as Error;

    const tracer = trace.getTracer("Error Boundary");
    tracer.startActiveSpan("Error Boundary", (span) => {
      span.recordException(error);

      // Optional: Set custom attributes on the trace
      span.setAttribute("stackTrace", error.stack ?? "");
      span.setAttribute("errorMessage", error.message);

      // Mark the span with an error status
      span.setStatus({
        code: SpanStatusCode.ERROR,
      });

      //Always end the open span
      span.end();
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log errors from the logging endpoint itself
    logger.error("Failed to process browser error", error as Error);
    return NextResponse.json(
      { error: "Failed to process browser error" },
      { status: 500 },
    );
  }
}
