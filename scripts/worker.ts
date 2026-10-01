/**
 * Entrypoint of the background worker, per acme-app-aws's `EcsFargateTask` invocation contract
 * (`infrastructure/components/ecs-fargate-task.md`): the same poll loop runs as the AWS container
 * entrypoint (started by `ecs:RunTask`, see `src/server/services/jobs/ecs-task-runner.ts`) and as
 * a local process (`docker compose --profile worker up worker`, or `pnpm worker`) -- same binary,
 * no environment-specific branch here.
 *
 * The task is started without any per-job override: it finds its own work straight off the
 * database and drains the queue until nothing is left, then exits.
 *
 * Only one worker may be doing real work at a time. `dispatch` only starts a task when it believes
 * none is active, but that belief comes from database bookkeeping alone, so two tasks can end up
 * running together. A Postgres session-level advisory lock, held for the process's whole lifetime,
 * makes that harmless: the task that loses the lock exits immediately.
 *
 * Usage: `bun scripts/worker.ts`.
 */
import { Client } from "pg";
import { env } from "../src/env";
import { toDirectDatabaseUrl } from "./direct-database-url";

/** Arbitrary fixed key for the "only one worker at a time" lock -- any int64 works, it just has to
 * never collide with another advisory lock this app might one day take. */
const SINGLETON_WORKER_LOCK_KEY = 847_562_301_294n;

type Job = { id: string };

/** TODO: return the next queued job (oldest first), or `null` when the queue is empty. */
async function findNextJob(): Promise<Job | null> {
  return null;
}

/** TODO: do the work for one job and record its outcome. Must not throw for a business failure. */
async function processJob(_job: Job): Promise<void> {}

/**
 * `null` means another worker already holds the lock. Connects to the *direct* database endpoint,
 * never a pooler: a session-level advisory lock needs a dedicated backend session for its whole
 * lifetime, which transaction pooling does not guarantee (see `toDirectDatabaseUrl`).
 *
 * The returned client gets an `'error'` listener because it sits idle while jobs run: without one,
 * a connection dropped from the far end surfaces as an unhandled `'error'` event and crashes the
 * process.
 */
async function acquireSingletonLock(): Promise<Client | null> {
  const client = new Client({
    connectionString: toDirectDatabaseUrl(env.DATABASE_URL),
  });
  await client.connect();
  const { rows } = await client.query<{ locked: boolean }>(
    "select pg_try_advisory_lock($1) as locked",
    [SINGLETON_WORKER_LOCK_KEY],
  );
  if (!rows[0]?.locked) {
    await client.end();
    return null;
  }
  client.on("error", (err) => {
    console.error("worker: lock connection error", err);
  });
  return client;
}

async function pollLoop() {
  const lock = await acquireSingletonLock();
  if (!lock) {
    console.log(
      "worker: another worker already holds the singleton lock, exiting.",
    );
    return;
  }

  try {
    console.log("worker: polling for queued jobs...");
    let next = await findNextJob();
    while (next) {
      console.log(`worker: processing job ${next.id}`);
      await processJob(next);
      console.log(`worker: finished job ${next.id}`);
      next = await findNextJob();
    }
    console.log("worker: no more queued jobs, exiting.");
  } finally {
    // Release explicitly rather than leaving Postgres to notice the connection dropped.
    await lock.end();
  }
}

await pollLoop();
// Nothing else keeps Bun's event loop alive once the queue is drained: exit explicitly.
process.exit(0);
