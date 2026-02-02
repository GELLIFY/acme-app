import { env } from "@/env";
import { getTraceContext } from "../infrastructure/otel/get-trace-context";

type RequestContext = {
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
};

type UserContext = {
  user?: Record<string, unknown>;
  feature_flags?: Record<string, boolean>;
};

type InfrastructureContext = {
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
};

type ErrorContext = {
  error?: Record<string, unknown>;
};

type PerformanceContext = {
  db_query_count?: number;
  db_query_time_ms?: number;
  cache_hits?: number;
  cache_misses?: number;
  external_call_count?: number;
  external_call_time_ms?: number;
  memory_used_mb?: number;
  cpu_time_ms?: number;
};

// general contexts + business context
export type LogContext = Record<string, unknown> &
  RequestContext &
  UserContext &
  InfrastructureContext &
  ErrorContext &
  PerformanceContext;

// Tail sampling decision function
export function shouldSample(event: LogContext): boolean {
  // Always keep errors
  if (event.error) return true;

  // Always keep slow requests (above p99)
  if (event.duration_ms > 2000) return true;

  // Always keep VIP users
  if (event.user?.role === "admin") return true;

  // Always keep requests with feature flags (debugging rollouts)
  if (event.feature_flags) return true;

  // Random sample the rest at 5%
  return (
    Math.random() <
    (env.NODE_ENV === "development" ? 1 : Number(env.OTEL_TRACES_SAMPLER_ARG))
  );
}

export function createWideEvent(requestId: string): LogContext {
  const traceCtx = getTraceContext();

  return {
    request_id: requestId,
    trace_id: traceCtx.traceId,
    span_id: traceCtx.spanId,
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_TARGET_ENV || env.NODE_ENV,
    duration_ms: 0, // real value at the end of the request
  };
}
