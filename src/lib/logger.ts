import type { UserWithRole } from "better-auth/plugins";
import pino, { type Logger } from "pino";
import { ROLES } from "@/shared/helpers/better-auth/permissions";

export type WideEvent = Record<string, unknown> & {
  duration_ms: number;
  status_code: number;
  user?: UserWithRole;
  feature_flags?: Record<string, boolean>;
  error?: Record<string, unknown>;
};

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
      },
    },
  }),
});

// Tail sampling decision function
export function shouldSample(event: WideEvent): boolean {
  // Always keep errors
  if (event.status_code >= 500) return true;
  if (event.error) return true;

  // Always keep slow requests (above p99)
  if (event.duration_ms > 2000) return true;

  // Always keep VIP users
  if (event.user?.role === ROLES.ADMIN) return true;

  // Always keep requests with specific feature flags (debugging rollouts)
  if (event.feature_flags?.new_magic_flow) return true;

  // Random sample the rest at 5%
  return Math.random() < 0.05;
}
