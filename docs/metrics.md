# Metrics

## Web Vitals (client)

La metrica principale e lato browser, basata su `web-vitals` + OpenTelemetry.

- Provider: `src/components/web-vitals-provider.tsx`
- Implementazione: `src/shared/infrastructure/metrics/web-vitals.ts`

Il provider viene montato nel layout e chiama `initializeWebVitals()` una sola volta.

## Metriche esportate

Tutte esportate via OTLP HTTP con attributi `page` e `rating`:

- `web_vitals_lcp` (histogram, ms)
- `web_vitals_inp` (histogram, ms)
- `web_vitals_cls` (gauge, unita 1)
- `web_vitals_ttfb` (histogram, ms)
- `web_vitals_fcp` (histogram, ms)

## Configurazione exporter (client)

Attuale configurazione in `src/shared/infrastructure/metrics/web-vitals.ts`:

- Endpoint: `http://localhost:4318/v1/metrics`
- Interval: 10s
- Service name: `acme-app-frontend`

Nota: esiste `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` in `src/env.js`, ma **non e ancora usato** lato client. Se il collector cambia, aggiorna l'URL o collega la ENV.

## Esempio: metrica custom

```ts
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("ui");
const clickCounter = meter.createCounter("ui_clicks_total");

clickCounter.add(1, { component: "save_button" });
```

## Referenze

- https://signoz.io/blog/opentelemetry-nextjs/
- https://web.dev/vitals/
- https://github.com/GoogleChrome/web-vitals
- https://opentelemetry.io/docs/specs/otel/metrics/
