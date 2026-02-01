# Logs

## Flusso dei log

- **Server**: i log usano Pino e vengono esportati via OTLP verso il collector.
- **Client**: i log del browser vengono inviati a `/api/logs`, che li ritrasmette verso OTel.

```
Browser -> /api/logs -> logger server -> OTLP logs -> Collector
Server  -> pino-opentelemetry-transport -> OTLP logs -> Collector
```

## Inizializzazione exporter

- `src/instrumentation.ts` chiama `initializeLogsExporter()` quando il runtime e `nodejs`.
- `src/app/api/logs/route.ts` inizializza l'exporter al primo hit della route.

## Logger disponibili

### Server (Pino)

- File: `src/shared/infrastructure/logger/pino-logger.ts`
- Exporter: `pino-opentelemetry-transport`
- Livelli:
  - `production`: `info`
  - `development`: `debug` (con `pino-pretty` su console)
- Aggiunge `traceId` e `spanId` dal contesto OTel corrente.
- Redazione automatica di campi sensibili in produzione.

Esempio:

```ts
import { serverLogger } from "@/shared/infrastructure/logger/pino-logger";

serverLogger.info("user_created", { userId: "123" });
serverLogger.error("db_error", new Error("timeout"), { query: "select" });
```

## Structured logs

L'approccio e "event-first": log strutturati, non testo libero. Ogni log dovrebbe avere:

- Un **nome evento** chiaro (es. `user_created`, `db_error`, `wide_event`).
- Un **contesto** strutturato (oggetto), con campi consistenti.
- Campi OTel (`traceId`, `spanId`) per correlazione con le tracce.

Nel codice:

- `LogContext` e la forma base del contesto (file: `src/shared/infrastructure/logger/logger.ts`).
- `serverLogger` arricchisce automaticamente il contesto con `traceId` e `spanId`.
- `browserLogger` aggiunge `sessionId`, `url`, `userAgent` lato client.

Esempio consigliato:

```ts
serverLogger.info("user_created", {
  userId: "123",
  plan: "pro",
  source: "signup",
});
```

Esempio anti-pattern:

```ts
// Evitare log "parlanti" non strutturati
serverLogger.info("User 123 created with plan pro");
```

### Server (Logger semplice)

- File: `src/shared/infrastructure/logger/logger.ts`
- Exporter: `src/shared/infrastructure/logger/log-exporter.ts`
- Usato anche da `/api/logs` per inoltrare log client.

Esempio:

```ts
import { logger } from "@/shared/infrastructure/logger/logger";

logger.info("cache_warm", { key: "todos" });
logger.warn("rate_limited", { ip: "1.2.3.4" });
```

### Client (Browser logger)

- File: `src/shared/infrastructure/logger/browser-logger.ts`
- Invia batch ogni ~10s a `/api/logs` (via `sendBeacon` o `fetch`).
- Aggiunge `traceId`, `spanId`, `sessionId`, `url`, `userAgent`.

Esempio:

```ts
import { browserLogger } from "@/shared/infrastructure/logger/browser-logger";

browserLogger.info("ui_action", { action: "click", target: "save" });
```

## Logging di errori globali (client)

- `src/instrumentation-client.ts` aggancia `window.onerror` e `window.onunhandledrejection`.

## Wide events (log strutturati per request)

Sono log "wide" per tracing e debugging, con contesto ricco e sampling. L'idea e' avere **un log per request** con il massimo contesto utile, da usare per analisi e debugging.

- tRPC: `src/server/api/trpc/middleware/wide-event-plugin.ts`
- REST (Hono): `src/server/api/rest/middleware/with-wide-event.ts`
- Contesto: `src/shared/helpers/wide-event.ts`

Campi principali del wide-event:
- `request_id`, `trace_id`, `span_id`
- `method`, `path`, `status_code`, `duration_ms`
- `user`, `feature_flags`
- `error` (se presente)

Regole di sampling:
- Errori sempre loggati.
- Richieste lente > 2s sempre loggate.
- Admin e feature flags sempre loggati.
- Altrimenti ~5% (100% in dev).

Esempio in un handler:

```ts
// tRPC: ctx.wideEvent e disponibile
ctx.wideEvent.user = { id: "123", role: "admin" };
ctx.wideEvent.feature_flags = { new_ui: true };
```

Suggerimento: usa `wideEvent` per arricchire i log request-level, non per eventi specifici di business (per quelli usa log strutturati separati).

## Configurazione ENV (logs)

```
OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://localhost:4318/v1/logs
```

## Referenze

- https://loggingsucks.com/
- https://signoz.io/blog/opentelemetry-nextjs/
- https://opentelemetry.io/docs/specs/otel/logs/
- https://github.com/pinojs/pino
