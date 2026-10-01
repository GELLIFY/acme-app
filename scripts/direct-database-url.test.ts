import { describe, expect, test } from "bun:test";
import { toDirectDatabaseUrl } from "./direct-database-url";

describe("toDirectDatabaseUrl", () => {
  test("strips -pooler from a Neon PgBouncer host (#101)", () => {
    expect(
      toDirectDatabaseUrl(
        "postgres://user:pass@ep-cool-water-12345-pooler.eu-central-1.aws.neon.tech/db?sslmode=require",
      ),
    ).toBe(
      "postgres://user:pass@ep-cool-water-12345.eu-central-1.aws.neon.tech/db?sslmode=require",
    );
  });

  test("leaves an already-direct host untouched", () => {
    const url =
      "postgres://user:pass@ep-cool-water-12345.eu-central-1.aws.neon.tech/db?sslmode=require";
    expect(toDirectDatabaseUrl(url)).toBe(url);
  });

  test("leaves a non-Neon host untouched", () => {
    const url = "postgres://user:pass@localhost:5432/sinergas";
    expect(toDirectDatabaseUrl(url)).toBe(url);
  });

  test("only touches the host, never a -pooler substring elsewhere in the URL", () => {
    const url =
      "postgres://user:pass@ep-cool-water-12345-pooler.eu-central-1.aws.neon.tech/db-pooler-archive";
    expect(toDirectDatabaseUrl(url)).toBe(
      "postgres://user:pass@ep-cool-water-12345.eu-central-1.aws.neon.tech/db-pooler-archive",
    );
  });
});
