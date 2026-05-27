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
const env: NodeJS.ProcessEnv = { ...process.env };

if (hasPortless()) {
  const name = appName(branch);
  upsertEnvLocal({ BETTER_AUTH_URL: `https://${name}.localhost` });
  command = "portless";
  args = [name, "next", "dev"];
  console.log(`[dev] portless → https://${name}.localhost`);
} else {
  const port = fallbackPort(branch);
  env.PORT = String(port);
  upsertEnvLocal({ BETTER_AUTH_URL: `http://localhost:${port}` });
  command = "next";
  args = ["dev"];
  console.log(`[dev] portless not found → http://localhost:${port}`);
}

const child = spawn(command, args, { stdio: "inherit", env });
child.on("exit", (code: number | null) => process.exit(code ?? 0));
