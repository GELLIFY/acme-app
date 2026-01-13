# Observability Stack

This stack runs an OpenTelemetry Collector with Jaeger, Zipkin, and Prometheus,
and can forward data to SigNoz Cloud.

## Setup

1. `cp .env.example .env`
2. Edit `.env` with your SigNoz ingestion key and region.
3. Start the stack:

```
OTELCOL_IMG=otel/opentelemetry-collector-contrib:latest docker compose up -d
```

## Endpoints

- Collector OTLP HTTP: `http://localhost:4318`
- Collector OTLP gRPC: `http://localhost:4317`
- Jaeger UI: `http://localhost:16686`
- Zipkin UI: `http://localhost:9411`
- Prometheus: `http://localhost:9090`

## Notes

- If you do not want to send data to SigNoz Cloud, leave the `SIGNOZ_*`
  variables empty.
- Update `otel-collector-config.yaml` if you need to change CORS origins or
  exporter settings.
