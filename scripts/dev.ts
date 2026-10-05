import { spawn } from "node:child_process";

import {
  appName,
  currentBranch,
  fallbackPort,
  hasPortless,
  upsertEnvLocal,
} from "./lib/worktree";

const branch = currentBranch();

let command: string;
let args: string[];
// Bun auto-loads .env into process.env before this runs, so the BETTER_AUTH_URL
// inherited here may be the stale .env default; real env beats .env.local in Next.
const env: NodeJS.ProcessEnv = { ...process.env };

if (hasPortless()) {
  const name = appName(branch);
  env.BETTER_AUTH_URL = `https://${name}.localhost`;
  upsertEnvLocal({ BETTER_AUTH_URL: env.BETTER_AUTH_URL });
  command = "portless";
  args = [name, "next", "dev"];
  console.log(`[dev] portless → https://${name}.localhost`);
} else {
  const port = fallbackPort(branch);
  env.PORT = String(port);
  env.BETTER_AUTH_URL = `http://localhost:${port}`;
  upsertEnvLocal({ BETTER_AUTH_URL: env.BETTER_AUTH_URL });
  command = "next";
  args = ["dev"];
  console.log(`[dev] portless not found → http://localhost:${port}`);
}

const child = spawn(command, args, { stdio: "inherit", env });
child.on("exit", (code: number | null) => process.exit(code ?? 0));
