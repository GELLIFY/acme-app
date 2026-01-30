import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/shared/infrastructure/logger/logger";
import { type MetricEntry, meter } from "@/shared/infrastructure/metrics/meter";
import { initializeMetricsExporter } from "@/shared/infrastructure/metrics/metric-exporter";

// Initialize the OTLP exporter when this route is first hit
initializeMetricsExporter();

export async function POST(request: NextRequest) {
  try {
    const metrics = (await request.json()) as MetricEntry[];
    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { error: "Invalid metrics payload" },
        { status: 400 },
      );
    }

    for (const metricEntry of metrics) {
      // Use our server-side meter to forward the metric
      meter.record(metricEntry);
    }

    return NextResponse.json({ success: true, processed: metrics.length });
  } catch (error) {
    // Log errors from the logging endpoint itself
    logger.error("Failed to process browser metrics", error as Error);
    return NextResponse.json(
      { error: "Failed to process metrics" },
      { status: 500 },
    );
  }
}
