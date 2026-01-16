# OpenTelemetry (OTel)

## Scopo e flusso

Questa app usa OpenTelemetry per tracce, log e metriche e invia tutto a un **OTel Collector generico** (non legato a SigNoz). Il collector puo poi inoltrare verso SigNoz, Grafana, Tempo, Datadog, ecc.

Flusso tipico:

```
App (Next.js) -> OTel Collector (OTLP HTTP) -> Backend osservabilita
```

## Dove si inizializza

- `src/instrumentation.ts` registra OTel lato server con `@vercel/otel`.
- `src/instrumentation-client.ts` aggancia handler client per errori non gestiti (log client).
- Next.js carica automaticamente questi file se presenti (hook di instrumentation).

## Configurazione via ENV (traces)

Queste variabili sono standard OTel e configurano il collector e il sampling:

```
OTEL_SERVICE_NAME=acme-app
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=http/protobuf
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.05
```

Note:
- In `src/env.js` sono definite tutte le ENV supportate.
- `OTEL_EXPORTER_OTLP_ENDPOINT` e le endpoint specifiche per signal permettono di puntare a un collector diverso senza cambiare codice.

## Cosa viene tracciato

- **Next.js + @vercel/otel**: tracce automatiche per request e runtime.
  - File: `src/instrumentation.ts`.
- **Fetch in uscita**: propagazione del contesto per domini specifici.
  - `propagateContextUrls` include `images.unsplash.com` (modificabile).
- **tRPC**: span custom per procedure.
  - File: `src/server/api/trpc/middleware/otel-plugin.ts`.
- **Database (Drizzle)**: instrumentazione tramite `@kubiks/otel-drizzle`.
  - File: `src/server/db/index.ts`.
- **Auth**: span per Better Auth (API + HTTP hooks).
  - File: `src/shared/infrastructure/otel/otel-better-auth.ts`.
  - Hook in `src/shared/infrastructure/better-auth/auth.ts`.
- **Email**: Resend instrumentato con `@kubiks/otel-resend`.
  - File: `src/shared/infrastructure/resend/index.ts`.

## Creare span personalizzati

Esempio server-side (Span manuale):

```ts
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("acme-custom");

await tracer.startActiveSpan("custom.operation", async (span) => {
  try {
    // ...lavoro applicativo
    span.setAttribute("custom.flag", true);
  } catch (error) {
    span.recordException(error as Error);
    throw error;
  } finally {
    span.end();
  }
});
```

## Collector generico (non SigNoz)

Lato app usiamo OTLP HTTP. Qualsiasi collector compatibile OTLP va bene:

- **Dev locale**: punta a `http://localhost:4318`.
- **Prod**: configura `OTEL_EXPORTER_OTLP_*` verso il tuo collector.

Puoi ispirarti agli esempi SigNoz solo per la parte OTel/Next.js; il backend e intercambiabile.

## File chiave

- `src/instrumentation.ts`
- `src/instrumentation-client.ts`
- `src/server/api/trpc/middleware/otel-plugin.ts`
- `src/server/db/index.ts`
- `src/shared/infrastructure/otel/otel-better-auth.ts`
- `src/shared/infrastructure/resend/index.ts`
- `src/env.js`

## Referenze

- https://signoz.io/blog/opentelemetry-nextjs/
- https://opentelemetry.io/docs/specs/otel/overview/
- https://opentelemetry.io/docs/instrumentation/js/
- https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
