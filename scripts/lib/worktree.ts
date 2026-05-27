import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const MAIN_BRANCHES = new Set(["main", "master"]);

/** Base Postgres connection (without a database) for the shared local instance. */
const POSTGRES_BASE_URL =
  process.env.POSTGRES_BASE_URL ?? "postgres://postgres:postgres@localhost:5432";

export function currentBranch(): string {
  return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
  }).trim();
}

function slug(branch: string, separator: string): string {
  return branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(
      new RegExp(`^\\${separator}+|\\${separator}+$`, "g"),
      "",
    );
}

/** Database name inside the shared Postgres for this worktree. */
export function databaseName(branch: string): string {
  if (MAIN_BRANCHES.has(branch)) return "main";
  return `main_${slug(branch, "_")}`.slice(0, 63);
}

/** Portless app name (becomes <name>.localhost). */
export function appName(branch: string): string {
  if (MAIN_BRANCHES.has(branch)) return "acme";
  return `acme-${slug(branch, "-")}`;
}

export function databaseUrl(branch: string): string {
  return `${POSTGRES_BASE_URL}/${databaseName(branch)}`;
}

export function adminDatabaseUrl(): string {
  return `${POSTGRES_BASE_URL}/postgres`;
}

export function hasPortless(): boolean {
  return spawnSync("portless", ["--version"], { stdio: "ignore" }).status === 0;
}

/** Deterministic dev-server port for the no-portless fallback. */
export function fallbackPort(branch: string): number {
  if (MAIN_BRANCHES.has(branch)) return 3000;
  let hash = 0;
  for (const char of branch) hash = (hash * 31 + char.charCodeAt(0)) % 1000;
  return 3001 + hash;
}

/** Merge keys into .env.local, preserving any other lines already there. */
export function upsertEnvLocal(values: Record<string, string>): void {
  const path = ".env.local";
  const lines = existsSync(path)
    ? readFileSync(path, "utf8").split("\n").filter(Boolean)
    : [];
  const map = new Map<string, string>();
  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq > 0) map.set(line.slice(0, eq), line.slice(eq + 1));
  }
  for (const [key, value] of Object.entries(values)) map.set(key, value);
  const body = [...map].map(([k, v]) => `${k}=${v}`).join("\n");
  writeFileSync(path, `${body}\n`);
}
