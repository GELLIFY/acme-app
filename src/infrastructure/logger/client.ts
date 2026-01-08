import { format } from "date-fns";
import { type Logger, pino } from "pino";

const COLOR = {
  GREEN: `\x1b[32m`,
  RED: `\x1b[31m`,
  WHITE: `\x1b[37m`,
  YELLOW: `\x1b[33m`,
  CYAN: `\x1b[36m`,
};

const LEVEL_COLORS = {
  FATAL: COLOR.RED,
  ERROR: COLOR.RED,
  WARN: COLOR.YELLOW,
  INFO: COLOR.GREEN,
  DEBUG: COLOR.GREEN,
  TRACE: COLOR.GREEN,
};

const logger: Logger = pino({
  browser: {
    asObject: true,
    write: (logObj) => {
      const { level, msg, group, time } = logObj as Record<string, string>;

      const logLevel = level?.toUpperCase() ?? "UNKNOWN";
      const dateTime = time ? new Date(time) : new Date();
      const timeFormatted = format(new Date(dateTime), `HH:mm:ss`);

      const LEVEL_COLOR = LEVEL_COLORS[logLevel as keyof typeof LEVEL_COLORS];

      console.log(
        `[${timeFormatted}] ${LEVEL_COLOR}${logLevel} ${COLOR.CYAN}[${group}] ${msg} ${COLOR.WHITE}`,
      );
    },
    formatters: {
      level: (label) => {
        return {
          level: label,
        };
      },
    },
  },
  level: process.env.LOG_LEVEL || "info",
});

export const clientLogger = logger.child({ group: "client" });
