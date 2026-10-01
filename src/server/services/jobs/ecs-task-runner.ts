import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { env } from "@/env";
import type { DispatchResult, TaskRunner } from "./task-runner";

export type EcsTaskRunnerConfig = {
  region?: string;
  /** Static credentials, only for environments without an IAM role (e.g. local development). */
  accessKeyId?: string;
  secretAccessKey?: string;
  /** From `ECS_CLUSTER` (acme-app-aws's `EcsFargateTask` invocation contract). */
  cluster?: string;
  /** From `WORKER_TASK_DEFINITION` -- family ARN without a revision. */
  taskDefinition?: string;
  /** From `WORKER_CONTAINER_NAME`; only part of the completeness check, since no container
   * override is passed. Its absence signals the `EcsFargateTask` contract is not fully wired. */
  containerName?: string;
  /** From `WORKER_SECURITY_GROUP_ID` (singular: the component creates exactly one). */
  securityGroupId?: string;
  /** From `WORKER_SUBNET_IDS`, comma-separated. */
  subnetIds?: string[];
};

/**
 * Dispatches the worker as a one-off `ecs:RunTask` invocation against the Fargate task
 * acme-app-aws's `EcsFargateTask` component provisions. Its entrypoint is `scripts/worker.ts`'s
 * poll loop: no per-job override is passed, the task drains the queue itself and exits.
 *
 * `RunTask` answers 200 with a non-empty `failures` array when a task cannot be placed instead of
 * throwing; that, like any thrown error, is reported as `{ ok: false }`.
 *
 * Takes its configuration explicitly (rather than reading `env`) so it stays testable;
 * `ecsTaskRunner()` below wires it to `env`.
 */
export function createEcsTaskRunner(config: EcsTaskRunnerConfig): TaskRunner {
  const client = new ECSClient({
    region: config.region,
    ...(config.accessKeyId && config.secretAccessKey
      ? {
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        }
      : {}),
  });

  return {
    async dispatch(): Promise<DispatchResult> {
      if (
        !config.cluster ||
        !config.taskDefinition ||
        !config.containerName ||
        !config.securityGroupId ||
        !config.subnetIds?.length
      ) {
        return {
          ok: false,
          detail:
            "Incomplete ECS configuration: ECS_CLUSTER, WORKER_TASK_DEFINITION, " +
            "WORKER_CONTAINER_NAME, WORKER_SECURITY_GROUP_ID and WORKER_SUBNET_IDS are " +
            "required when JOB_DRIVER=ecs.",
        };
      }

      try {
        const result = await client.send(
          new RunTaskCommand({
            cluster: config.cluster,
            taskDefinition: config.taskDefinition,
            launchType: "FARGATE",
            count: 1,
            networkConfiguration: {
              awsvpcConfiguration: {
                subnets: config.subnetIds,
                securityGroups: [config.securityGroupId],
                // The component's default networking: public subnets, no NAT Gateway.
                assignPublicIp: "ENABLED",
              },
            },
          }),
        );

        if (result.failures && result.failures.length > 0) {
          const detail = result.failures
            .map((f) => f.reason ?? "unknown")
            .join(", ");
          return { ok: false, detail };
        }

        const taskArn = result.tasks?.[0]?.taskArn;
        if (!taskArn) {
          return { ok: false, detail: "RunTask returned no task ARN" };
        }
        return { ok: true, taskArn };
      } catch (error) {
        return {
          ok: false,
          detail: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}

/** `"a, b ,,c"` -> `["a", "b", "c"]`; `undefined` -> `undefined`. */
export function splitCsvEnv(value: string | undefined): string[] | undefined {
  return value
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

let cached: TaskRunner | undefined;

/** The real ECS task runner, configured from `env` (the variables acme-app-aws's
 * `EcsFargateTask`-enabled stack injects into the app's container environment). */
export function ecsTaskRunner(): TaskRunner {
  cached ??= createEcsTaskRunner({
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    cluster: env.ECS_CLUSTER,
    taskDefinition: env.WORKER_TASK_DEFINITION,
    containerName: env.WORKER_CONTAINER_NAME,
    securityGroupId: env.WORKER_SECURITY_GROUP_ID,
    subnetIds: splitCsvEnv(env.WORKER_SUBNET_IDS),
  });
  return cached;
}

/** The runner for the configured `JOB_DRIVER`: `undefined` under `local`, where the app leaves
 * the job queued and `scripts/worker.ts` (a separate process) picks it up. */
export function configuredTaskRunner(): TaskRunner | undefined {
  return env.JOB_DRIVER === "ecs" ? ecsTaskRunner() : undefined;
}
