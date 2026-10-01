/**
 * Rewrites a Neon `-pooler` (PgBouncer) host to its direct equivalent (#101).
 *
 * A Postgres session-level advisory lock (`pg_try_advisory_lock`) needs a
 * dedicated backend session for its whole lifetime — PgBouncer's transaction
 * pooling doesn't guarantee that: the worker's lock can outlive the pooled
 * connection that took it, so the *next* worker's `pg_try_advisory_lock`
 * finds the lock still held even though the previous worker already exited
 * (the incident this was added for: a preview Run stuck `dispatched`
 * forever behind a "phantom" lock). The lock connection must therefore go
 * straight to Postgres, bypassing the pooler entirely.
 *
 * Neon's pooled endpoint is always the direct one with `-pooler` inserted
 * right before the first `.` of the hostname (e.g.
 * `ep-cool-water-12345-pooler.eu-central-1.aws.neon.tech` →
 * `ep-cool-water-12345.eu-central-1.aws.neon.tech`) — a host-only rewrite,
 * never touched blindly as a string replace, so a `-pooler` substring
 * elsewhere in the URL (path, query) is never mangled. A non-Neon or
 * already-direct URL passes through unchanged.
 */
export function toDirectDatabaseUrl(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  url.hostname = url.hostname.replace(/-pooler(?=\.)/, "");
  return url.toString();
}
