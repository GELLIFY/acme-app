import { mock } from "bun:test";

// Mocked before importing the module under test, same technique
// src/tests/testing-db.ts and rcu-service.test.ts use for their dependencies.
let sendImpl: (command: unknown) => Promise<unknown> = async () => ({});

await mock.module("@aws-sdk/client-ecs", () => ({
  ECSClient: class {
    send(command: unknown) {
      return sendImpl(command);
    }
  },
  RunTaskCommand: class {
    constructor(public input: unknown) {}
  },
}));

const { describe, expect, test } = await import("bun:test");
const { createEcsTaskRunner, ecsTaskRunner, splitCsvEnv } = await import(
  "./ecs-task-runner"
);

const baseConfig = {
  region: "eu-south-1",
  accessKeyId: "test",
  secretAccessKey: "test",
};

const fullConfig = {
  ...baseConfig,
  cluster: "test-cluster",
  taskDefinition: "test-task-def",
  containerName: "app",
  securityGroupId: "sg-1",
  subnetIds: ["subnet-1", "subnet-2"],
};

describe("createEcsTaskRunner().dispatch", () => {
  test("returns ok:false without calling AWS when ECS config is incomplete", async () => {
    const runner = createEcsTaskRunner(baseConfig);
    const result = await runner.dispatch();
    expect(result.ok).toBe(false);
  });

  test("returns ok:true with the task ARN on a successful RunTask call", async () => {
    sendImpl = async () => ({
      tasks: [{ taskArn: "arn:aws:ecs:task/abc" }],
      failures: [],
    });
    const runner = createEcsTaskRunner(fullConfig);
    const result = await runner.dispatch();
    expect(result).toEqual({ ok: true, taskArn: "arn:aws:ecs:task/abc" });
  });

  test("returns ok:false when RunTask reports a failure", async () => {
    sendImpl = async () => ({
      tasks: [],
      failures: [{ reason: "RESOURCE:CPU" }],
    });
    const runner = createEcsTaskRunner(fullConfig);
    const result = await runner.dispatch();
    expect(result.ok).toBe(false);
  });

  test("returns ok:false when RunTask returns no task ARN", async () => {
    sendImpl = async () => ({ tasks: [], failures: [] });
    const runner = createEcsTaskRunner(fullConfig);
    const result = await runner.dispatch();
    expect(result.ok).toBe(false);
  });

  test("returns ok:false when the ECS client throws", async () => {
    sendImpl = async () => {
      throw new Error("network error");
    };
    const runner = createEcsTaskRunner(fullConfig);
    const result = await runner.dispatch();
    expect(result).toEqual({ ok: false, detail: "network error" });
  });
});

describe("ecsTaskRunner() (env-wired factory)", () => {
  test("returns the same instance on repeated calls", () => {
    expect(ecsTaskRunner()).toBe(ecsTaskRunner());
  });
});

describe("splitCsvEnv", () => {
  test("trims and drops empty entries", () => {
    expect(splitCsvEnv("subnet-1, subnet-2 ,,subnet-3")).toEqual([
      "subnet-1",
      "subnet-2",
      "subnet-3",
    ]);
  });

  test("passes undefined through", () => {
    expect(splitCsvEnv(undefined)).toBeUndefined();
  });
});
