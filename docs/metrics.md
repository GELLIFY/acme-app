# Metrics

## Web Vitals (client)

La metrica principale e lato browser, basata su `web-vitals` + OpenTelemetry.

- Provider: `src/components/web-vitals.tsx`
- Implementazione: `src/shared/infrastructure/metrics/web-vitals.ts`

Il provider viene montato nel layout e usa il custom hook `useReportWebVitals` per inviare le metriche all'api interna `/api/rum/vitals`.

## Metriche esportate

Tutte esportate via OTLP HTTP con attributi `page` e `device`:

- `web_vitals_lcp` (histogram, ms)
- `web_vitals_inp` (histogram, ms)
- `web_vitals_cls` (gauge, unita 1)
- `web_vitals_ttfb` (histogram, ms)
- `web_vitals_fcp` (histogram, ms)

## Configurazione exporter (client)

Attuale configurazione in `src/shared/infrastructure/otel/metric-exporter.ts`:

- Endpoint: `http://localhost:4318/v1/metrics`
- Interval: 10s
- Service name: `acme-app-frontend`

Nota: esiste `OTEL_EXPORTER_OTLP_METRICS_ENDPOINT` in `src/env.js`, ma **non è ancora usato** lato client. Se il collector cambia, aggiorna l'URL o collega la ENV.

## Esempio: metrica custom

```ts
import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("ui");
const clickCounter = meter.createCounter("ui_clicks_total");

clickCounter.add(1, { component: "save_button" });
```

## Referenze

- https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals
- https://signoz.io/blog/opentelemetry-nextjs/
- https://web.dev/vitals/
- https://github.com/GoogleChrome/web-vitals
- https://opentelemetry.io/docs/specs/otel/metrics/
