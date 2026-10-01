/**
 * A background job never executes in-process: the app only ever asks a `TaskRunner` to start an
 * ephemeral task, and that task (`scripts/worker.ts`) does the actual work.
 *
 * `dispatch` takes no job id: the task it starts figures out what to work on by itself, straight
 * off the database, exactly like the worker process local development runs. It must return quickly
 * and must never throw for an infrastructure failure -- any inability to start the task (the ECS
 * `RunTask` call failing, credentials or capacity problems, ...) is reported as `{ ok: false }`.
 */
export type DispatchResult =
  | { ok: true; taskArn: string }
  | { ok: false; detail: string };

export type TaskRunner = {
  dispatch(): Promise<DispatchResult>;
};
