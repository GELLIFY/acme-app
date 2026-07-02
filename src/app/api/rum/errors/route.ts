import { SpanStatusCode, trace } from "@opentelemetry/api";
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/libs/logger/logger";
import { browserErrorReportSchema } from "@/shared/validators/telemetry.schema";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (raw.length > 64_000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid error report payload" },
        { status: 400 },
      );
    }

    const parsed = browserErrorReportSchema.safeParse(parsedJson);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid error report payload" },
        { status: 400 },
      );
    }

    const tracer = trace.getTracer("Error Boundary");
    tracer.startActiveSpan("Error Boundary", (span) => {
      span.recordException({
        name: parsed.data.name ?? "Error",
        message: parsed.data.message,
        stack: parsed.data.stack,
      });

      // Optional: Set custom attributes on the trace
      span.setAttribute("stackTrace", parsed.data.stack ?? "");
      span.setAttribute("errorMessage", parsed.data.message);
      span.setAttribute("errorName", parsed.data.name ?? "Error");

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
