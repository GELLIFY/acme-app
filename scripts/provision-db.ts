import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";

import {
  adminDatabaseUrl,
  currentBranch,
  databaseName,
  databaseUrl,
  upsertEnvLocal,
} from "./lib/worktree";

/** Copy a usable .env (static secrets) into a fresh worktree if it lacks one. */
function bootstrapEnvFile(): void {
  if (existsSync(".env")) return;
  const worktrees = execFileSync("git", ["worktree", "list", "--porcelain"], {
    encoding: "utf8",
  });
  const primary = worktrees.match(/^worktree (.+)$/m)?.[1];
  const source =
    primary && existsSync(join(primary, ".env"))
      ? join(primary, ".env")
      : ".env.example";
  copyFileSync(source, ".env");
  console.log(`[provision] seeded .env from ${source}`);
}

/** Create the worktree's database if it does not yet exist. Returns true if created. */
async function ensureDatabase(name: string): Promise<boolean> {
  const pool = new Pool({ connectionString: adminDatabaseUrl() });
  try {
    const { rowCount } = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [name],
    );
    if (rowCount) return false;
    // Identifier is derived from the branch and validated by databaseName(); not user input.
    await pool.query(`CREATE DATABASE "${name}"`);
    return true;
  } finally {
    await pool.end();
  }
}

function run(command: string, dbUrl: string): void {
  const result = spawnSync("pnpm", command.split(" "), {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: dbUrl },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function main(): Promise<void> {
  const branch = currentBranch();
  const name = databaseName(branch);
  const url = databaseUrl(branch);

  bootstrapEnvFile();
  upsertEnvLocal({ DATABASE_URL: url });

  const created = await ensureDatabase(name);
  console.log(
    `[provision] branch=${branch} database=${name} ${created ? "(created)" : "(exists)"}`,
  );

  if (created) {
    run("db:migrate", url);
    run("db:seed", url);
  }
}

await main();
