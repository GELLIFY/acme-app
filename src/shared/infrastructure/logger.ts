import pino, { type Logger } from "pino";
import { env } from "@/env";
import { getTraceContext } from "./tracing";

// @ref https://loggingsucks.com/
export type LogContext = {
  // request context
  request_id: string; // request
  trace_id?: string; // otel trace id
  span_id?: string; // otel span id
  parent_span_id?: string;
  method?: string;
  path?: string;
  query_params?: Record<string, string>;
  status_code?: number;
  duration_ms: number;
  timestamp?: string;
  client_ip?: string;
  user_agent?: string;
  content_type?: string;
  request_size_bytes?: number;
  response_size_bytes?: number;

  // user context
  user?: Record<string, unknown>;
  feature_flags?: Record<string, boolean>;

  // infrastructure context
  service_name?: string;
  service_version?: string;
  deployment_id?: string;
  git_sha?: string;
  region?: string;
  availability_zone?: string;
  host?: string;
  container_id?: string;
  cloud_provider?: string;
  environment?: string;

  // error context
  error?: Record<string, unknown>;

  // performance context
  db_query_count?: number;
  db_query_time_ms?: number;
  cache_hits?: number;
  cache_misses?: number;
  external_call_count?: number;
  external_call_time_ms?: number;
  memory_used_mb?: number;
  cpu_time_ms?: number;
};

// Tail sampling decision function
export function shouldSample(event: LogContext): boolean {
  // Always keep errors
  if (event.error) return true;

  // Always keep slow requests (above p99)
  if (event.duration_ms > 2000) return true;

  // Always keep VIP users
  // if (event.user?.role === "admin") return true;

  // Always keep requests with specific feature flags (debugging rollouts)
  // if (event.feature_flags?.new_magic_flow) return true;

  // Random sample the rest at 5%
  return Math.random() < (env.NODE_ENV === "development" ? 1 : 0.05);
}

export function createWideEvent(requestId: string): LogContext {
  const traceCtx = getTraceContext();

  return {
    request_id: requestId,
    trace_id: traceCtx.traceId,
    span_id: traceCtx.spanId,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    duration_ms: 0, // real value at the end of the request
  };
}

export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // Use pretty printing in development, structured JSON in production
  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
        messageFormat: true,
        hideObject: false,
        singleLine: true,
      },
    },
  }),
});
