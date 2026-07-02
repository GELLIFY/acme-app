import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { requestWithCookies } from "./http";

describe("requestWithCookies", () => {
  const echoApp = new Hono().get("/echo", (c) =>
    c.json({
      cookie: c.req.raw.headers.get("cookie"),
      apiKey: c.req.raw.headers.get("x-api-key"),
    }),
  );

  test("negative control: a plain Request drops the Cookie header", () => {
    // This is WHY the helper exists — if this ever stops being null, the
    // forbidden-header stripping changed and the helper may be unnecessary.
    const naive = new Request("http://localhost/echo", {
      headers: { cookie: "better-auth.session_token=tok" },
    });
    expect(naive.headers.get("cookie")).toBeNull();
  });

  test("delivers a single cookie to a Hono handler", async () => {
    const res = await echoApp.request(
      requestWithCookies("/echo", {
        "better-auth.session_token": "tok",
      }),
    );
    const body = (await res.json()) as { cookie: string | null };
    expect(body.cookie).toBe("better-auth.session_token=tok");
  });

  test("joins multiple cookies and preserves other init headers", async () => {
    const res = await echoApp.request(
      requestWithCookies(
        "/echo",
        { "__Secure-better-auth.session_token": "tok", locale: "it" },
        { headers: { "x-api-key": "k1" } },
      ),
    );
    const body = (await res.json()) as {
      cookie: string | null;
      apiKey: string | null;
    };
    expect(body.cookie).toBe(
      "__Secure-better-auth.session_token=tok; locale=it",
    );
    expect(body.apiKey).toBe("k1");
  });
});
