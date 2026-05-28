#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const scriptPath = new URL("./check-repo-hygiene.mjs", import.meta.url).pathname;
const result = spawnSync(
  process.execPath,
  [scriptPath, "--only", "readme", ...process.argv.slice(2)],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
