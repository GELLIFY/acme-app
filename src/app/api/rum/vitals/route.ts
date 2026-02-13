import { type NextRequest, NextResponse } from "next/server";
import type { Metric } from "web-vitals";
import { logger } from "@/infrastructure/logger/logger";
import {
  exportMetricEntry,
  initializeMetricsExporter,
} from "@/infrastructure/otel/metric-exporter";

// Initialize the OTLP exporter when this route is first hit
initializeMetricsExporter();

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as {
      metric: Metric;
      device: UAParser.IDevice["type"];
      page: string;
    };

    const { metric, device, page } = data;
    exportMetricEntry(metric, { device, page });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log errors from the logging endpoint itself
    logger.error("Failed to process browser metrics", error as Error);
    return NextResponse.json(
      { error: "Failed to process browser metrics" },
      { status: 500 },
    );
  }
}
