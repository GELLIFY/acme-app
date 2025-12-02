import { afterEach, describe, expect, it } from "bun:test";
import { getBaseUrl } from "@/shared/helpers/get-url";

describe("getBaseUrl", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalPort = process.env.PORT;

  afterEach(() => {
    // @ts-expect-error overriding for testing purposes
    process.env.NODE_ENV = originalNodeEnv;
    process.env.PORT = originalPort;
  });

  it("returns localhost with default port 3000 in test env when PORT is not set", () => {
    delete process.env.PORT;
    // @ts-expect-error overriding for testing purposes
    process.env.NODE_ENV = "test";

    const result = getBaseUrl();

    expect(result).toBe("http://localhost:3000");
  });

  it("respects PORT env in test env", () => {
    // @ts-expect-error overriding for testing purposes
    process.env.NODE_ENV = "test";
    process.env.PORT = "4000";

    const result = getBaseUrl();

    expect(result).toBe("http://localhost:4000");
  });

  it("falls back to localhost and PORT when not in browser and not in test env", () => {
    const originalWindow = (globalThis as unknown as { window?: unknown })
      .window;

    // Simulate a non-browser environment
    delete (globalThis as unknown as { window?: unknown }).window;

    // @ts-expect-error overriding for testing purposes
    process.env.NODE_ENV = "production";
    process.env.PORT = "5001";

    const result = getBaseUrl();

    expect(result).toBe("http://localhost:5001");

    // Restore original window if it existed
    if (originalWindow) {
      (globalThis as unknown as { window?: unknown }).window = originalWindow;
    }
  });
});
