/**
 * Registers application instrumentation.
 *
 * This function can be used to initialize monitoring, tracing,
 * or to load secrets from a secret manager if required.
 * Call this early in your application's lifecycle.
 */
export async function register() {
  // Example: fetch secrets from a secret manager here if needed
  console.debug("Secrets loaded!");
}
