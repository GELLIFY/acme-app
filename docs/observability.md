# Observability (SigNoz + OpenTelemetry)

This repo ships full OpenTelemetry instrumentation for traces, logs, and web
vitals, aligned with the SigNoz Next.js guide.

## Local collector stack

1. `cp infra/observability/.env.example infra/observability/.env`
2. `cd infra/observability`
3. `OTELCOL_IMG=otel/opentelemetry-collector-contrib:latest docker compose up -d`

Ports:
- `4317`/`4318` OTLP (gRPC/HTTP)
- `16686` Jaeger UI
- `9411` Zipkin UI
- `9090` Prometheus

## App environment variables

Set these in `.env` (see `.env.example`):

- `OTEL_SERVICE_NAME`
- `OTEL_EXPORTER_OTLP_ENDPOINT` (collector endpoint)
- `OTEL_EXPORTER_OTLP_HEADERS` (SigNoz Cloud ingestion key)
- `NEXT_PUBLIC_OTEL_SERVICE_NAME` (web vitals service)
- `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` (browser metrics)

## Traces and external API propagation

`src/instrumentation.ts` propagates context for `fetch()` calls based on
`OTEL_FETCH_PROPAGATE_CONTEXT_URLS` (comma-separated regex list). Example:

```
OTEL_FETCH_PROPAGATE_CONTEXT_URLS="jsonplaceholder\\.typicode\\.com,httpbin\\.org"
```

Use `OTEL_FETCH_IGNORE_URLS` to exclude noisy endpoints.

## Logs

Server logs are sent to the OTLP logs pipeline automatically. Browser logs are
buffered and posted to `/api/logs`, including unhandled errors and promise
rejections.

## Web vitals

Web vitals are exported as OTLP metrics from the browser. Ensure the collector
HTTP receiver allows CORS for your local app origin.

## Third-party widget spans

If you need to measure third-party widgets, wrap the load with a manual span:

```
"use client";
import { useEffect } from "react";
import { trace } from "@opentelemetry/api";

export const ThirdPartyWidget = () => {
  useEffect(() => {
    const tracer = trace.getTracer("widget-load");
    const span = tracer.startSpan("load_third_party_widget");

    const script = document.createElement("script");
    script.src = "https://widget.example.com/widget.js";
    script.async = true;
    script.onload = () => span.end();
    document.body.appendChild(script);
  }, []);

  return null;
};
```

If you want to export browser spans, add a browser tracer provider (not enabled
by default).

## Production notes

Direct export to SigNoz Cloud (no collector):

```
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.<region>.signoz.cloud:443
OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=<your-key>
```

Sampling (example):

```
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```
