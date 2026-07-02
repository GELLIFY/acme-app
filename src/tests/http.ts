/**
 * Build a `Request` that carries a `Cookie` header.
 *
 * `new Request(url, { headers: { cookie } })` silently drops the cookie:
 * `Cookie` is a Fetch "forbidden request-header", so both happy-dom's global
 * `Request` (registered in `src/tests/happydom.ts`) and Bun's native `Request`
 * strip it in the constructor. Setting it via `Headers.set` *after*
 * construction is not filtered, so the value survives. Route the returned
 * request through `app.request(request)` — Hono passes a `Request` instance
 * through without re-wrapping (and thus without re-stripping) it.
 *
 * @param path - Request path or URL. Relative paths resolve against
 *   `http://localhost`.
 * @param cookies - Cookie name/value pairs, joined into one `Cookie` header.
 * @param init - Optional `RequestInit` (method, body, other headers, …).
 *   Non-forbidden headers here are preserved as usual.
 */
export const requestWithCookies = (
  path: string,
  cookies: Record<string, string>,
  init?: RequestInit,
): Request => {
  const request = new Request(new URL(path, "http://localhost"), init);
  const cookieHeader = Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
  request.headers.set("cookie", cookieHeader);
  return request;
};
