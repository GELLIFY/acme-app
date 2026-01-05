import { afterEach, describe, expect, it } from "bun:test";
import { randomUUIDv7 } from "bun";
import { createWideEvent, shouldSample } from "./wide-event";

const originalRandom = Math.random;

afterEach(() => {
  Math.random = originalRandom;
});

const baseEvent = () => ({
  request_id: "request-id",
  duration_ms: 0,
});

describe("shouldSample", () => {
  it("keeps error events", () => {
    Math.random = () => 0.99;

    const event = {
      ...baseEvent(),
      error: { message: "boom" },
    };

    expect(shouldSample(event)).toBe(true);
  });

  it("keeps slow requests", () => {
    Math.random = () => 0.99;

    const event = {
      ...baseEvent(),
      duration_ms: 2001,
    };

    expect(shouldSample(event)).toBe(true);
  });

  it("samples when random is under the threshold", () => {
    Math.random = () => 0.01;

    expect(shouldSample(baseEvent())).toBe(true);
  });

  it("drops when random is over the threshold", () => {
    Math.random = () => 0.5;

    expect(shouldSample(baseEvent())).toBe(false);
  });
});

describe("createWideEvent", () => {
  it("creates a wide event with defaults and trace context", () => {
    const event = createWideEvent(randomUUIDv7());

    expect(event.duration_ms).toBe(0);
    expect(event.environment).toBe("test");
    expect(event.trace_id).toBeUndefined();
    expect(event.span_id).toBeUndefined();

    expect(event.request_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );

    expect(new Date(event.timestamp ?? "").toISOString()).toBe(
      event.timestamp!,
    );
  });
});
